<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import NavBar from "../LoginFolder/NavBar.vue";
import keycloak from "../../auth/AuthService";
import {
  getToken,
  isAuthenticated,
  isLoggedIn,
  LogOut,
} from "../../auth/AuthService";
import axiosInstance from "../../axios";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import interactivePlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Calendar from "./Calendar.vue";

const adminName = ref("");
const details = reactive({
  bookusername: "",
  labname: "",
});

adminName.value = keycloak.idTokenParsed?.preferred_username;
// adminName.value = "book-admin";

onMounted(async () => {
  const resp = await axiosInstance.get("/user");
  let data = resp.data;
  console.log("username role ", data.username, data.role);
  if (resp.status === 200) {
    console.log("HTTP request OK");

    if (data.role === "[ROLE_ADMIN]") {
      console.log("admin role for user");
    }
    console.log(
      "response data from ok http " + data.username + " " + data.role,
    );
  }

  if (data.username === adminName.value) {
    console.log("keycloak user and db user same");
  }
});

console.log("isAdmin is ", adminName.value);

// const props = defineProps({
//   keycloak: {
//     type: Object,
//     required: true
//   }
// })

// ── Classroom mode ──────────────────────────────────
const activeMode = ref("classroom");
const selectedClassroom = ref("");
const loading = ref(false);
const activeFilter = ref("pending");
const requests = ref([]);

const filterTabs = [
  { value: "all", label: "Όλα" },
  { value: "pending", label: "Εκκρεμή" },
  { value: "accepted", label: "Αποδεκτά" },
  { value: "rejected", label: "Απορριφθέντα" },
];

const classrooms = [
  { id: "A101", name: "Αίθουσα Α101" },
  { id: "B202", name: "Αίθουσα Β202" },
  { id: "LAB1", name: "Εργαστήριο ΔΕΠΥ Α" },
  { id: "LAB2", name: "Εργαστήριο ΔΕΠΥ Β" },
  { id: "LAB3", name: "Εργαστήριο ΔΕΠΥ Γ" },
];

const pendingRequests = computed(() =>
  requests.value.filter((r) => r.status === "pending"),
);
const filteredRequests = computed(() => {
  if (activeFilter.value === "all") return requests.value;
  return requests.value.filter((r) => r.status === activeFilter.value);
});

async function fetchRequests() {
  if (!selectedClassroom.value) return;
  loading.value = true;
  requests.value = [];
  const token = getToken();
  try {
    const res = await fetch(
      `/api/classrooms/${selectedClassroom.value}/requests`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    requests.value = await res.json();
  } catch (err) {
    console.error("Error fetching requests:", err);
  } finally {
    loading.value = false;
  }
}

async function handleRequest(request, newStatus) {
  request.processing = true;
  const token = getToken();
  try {
    await fetch(`/api/reservations/${request.id}/${newStatus}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    request.status = newStatus;
    request.processedBy = keycloak.idTokenParsed?.preferred_username;
    request.processedAt = new Date().toISOString().split("T")[0];
  } catch (err) {
    console.error("Error updating request:", err);
  } finally {
    request.processing = false;
  }
}

// ── Lab semester mode ───────────────────────────────
const labs = ["ΔΕΠΥ Α", "ΔΕΠΥ Β", "ΔΕΠΥ Γ"];

const semesters = [
  { value: "2023-spring", label: "Εαρινό 2023" },
  { value: "2023-fall", label: "Χειμερινό 2023-2024" },
  { value: "2024-spring", label: "Εαρινό 2024" },
  { value: "2024-fall", label: "Χειμερινό 2024-2025" },
  { value: "2025-spring", label: "Εαρινό 2025" },
  { value: "2025-fall", label: "Χειμερινό 2025-2026" },
];

const labForm = ref({
  email: "",
  labName: "",
  semester: "",
  targetSemester: "",
});
const labFormErrors = ref({});
const labSubmitting = ref(false);
const labSubmitSuccess = ref(false);

const labEmailRequests = ref([
  {
    id: 1,
    email: "nkonstantinou@unipi.gr",
    labName: "ΔΕΠΥ Α",
    semester: "2024-fall",
  },
  {
    id: 2,
    email: "mantoniou@unipi.gr",
    labName: "ΔΕΠΥ Β",
    semester: "2024-spring",
  },
]);

function prefillLabForm(emailReq) {
  labForm.value.email = emailReq.email;
  labForm.value.labName = emailReq.labName;
  labForm.value.semester = emailReq.semester;
  labForm.value.targetSemester = "";
  labFormErrors.value = {};
  labSubmitSuccess.value = false;
}

function validateLabForm() {
  const errors = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!labForm.value.email) errors.email = "Απαιτείται email.";
  else if (!emailRe.test(labForm.value.email))
    errors.email = "Μη έγκυρο email.";
  if (!labForm.value.labName) errors.labName = "Επιλέξτε εργαστήριο.";
  if (!labForm.value.semester) errors.semester = "Επιλέξτε εξάμηνο πηγής.";
  if (!labForm.value.targetSemester)
    errors.targetSemester = "Επιλέξτε εξάμηνο προορισμού.";
  if (
    labForm.value.semester &&
    labForm.value.semester === labForm.value.targetSemester
  )
    errors.targetSemester =
      "Το εξάμηνο προορισμού πρέπει να διαφέρει από την πηγή.";
  labFormErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function submitLabRenewal() {
  labSubmitSuccess.value = false;
  if (!validateLabForm()) return;
  labSubmitting.value = true;
  const token = getToken();
  try {
    await fetch("/api/labs/renew-semester", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(labForm.value),
    });
    labSubmitSuccess.value = true;
    labEmailRequests.value = labEmailRequests.value.filter(
      (er) =>
        !(
          er.email === labForm.value.email &&
          er.semester === labForm.value.semester
        ),
    );
    resetLabForm();
  } catch (err) {
    console.error("Error renewing lab semester:", err);
  } finally {
    labSubmitting.value = false;
  }
}

function resetLabForm() {
  labForm.value = { email: "", labName: "", semester: "", targetSemester: "" };
  labFormErrors.value = {};
}

// ── Shared helpers ──────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusLabel(status) {
  return (
    { pending: "Εκκρεμές", accepted: "Αποδεκτό", rejected: "Απορριφθέν" }[
      status
    ] || status
  );
}

function semesterLabel(value) {
  const s = semesters.find((s) => s.value === value);
  return s ? s.label : value;
}
</script>
<!--  -->
<template>
  <div>
    <NavBar
      :bookuser="keycloak.idTokenParsed?.preferred_username"
      :logout="false"
    />

    <main class="admin-main">
      <!-- Page Header -->
      <section class="page-header">
        <div class="header-inner">
          <i class="ti ti-shield-check" aria-hidden="true"></i>
          <div>
            <h1>Πίνακας Διαχειριστή</h1>
            <p>Επιλέξτε τον τύπο διαχείρισης που θέλετε να εκτελέσετε</p>
          </div>
        </div>
      </section>

      <!-- Mode Switcher -->
      <section class="mode-switcher">
        <button
          :class="['mode-card', { active: activeMode === 'classroom' }]"
          @click="activeMode = 'classroom'"
        >
          <div class="mode-icon">
            <i class="ti ti-building" aria-hidden="true"></i>
          </div>
          <div class="mode-text">
            <span class="mode-title">Αιτήματα Κράτησης Αίθουσας</span>
            <span class="mode-desc"
              >Αποδοχή ή απόρριψη αιτημάτων κράτησης ανά αίθουσα</span
            >
          </div>
          <i class="ti ti-chevron-right mode-arrow" aria-hidden="true"></i>
        </button>

        <button
          :class="['mode-card', { active: activeMode === 'lab' }]"
          @click="activeMode = 'lab'"
        >
          <div class="mode-icon lab">
            <i class="ti ti-refresh" aria-hidden="true"></i>
          </div>
          <div class="mode-text">
            <span class="mode-title">Ανανέωση Εργαστηρίου Εξαμήνου</span>
            <span class="mode-desc"
              >Επανάληψη κρατήσεων εργαστηρίου από προηγούμενο εξάμηνο</span
            >
          </div>
          <i class="ti ti-chevron-right mode-arrow" aria-hidden="true"></i>
        </button>
      </section>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- MODE A: Classroom Reservation Requests            -->
      <!-- ══════════════════════════════════════════════════ -->
      <template v-if="activeMode === 'classroom'">
        <!-- Classroom Selector -->
        <section class="section-card">
          <label class="field-label" for="classroom-select">
            <i class="ti ti-door" aria-hidden="true"></i>
            Επιλογή Αίθουσας
          </label>
          <div class="select-wrapper">
            <select
              id="classroom-select"
              v-model="selectedClassroom"
              @change="fetchRequests"
            >
              <option value="" disabled>— Επιλέξτε αίθουσα —</option>
              <option
                v-for="room in classrooms"
                :key="room.id"
                :value="room.id"
              >
                {{ room.name }}
              </option>
            </select>
            <i class="ti ti-chevron-down select-icon" aria-hidden="true"></i>
          </div>
        </section>

        <!-- Requests List -->
        <section class="section-card" v-if="selectedClassroom">
          <div class="requests-header">
            <h2>
              <i class="ti ti-list-check" aria-hidden="true"></i>
              Αιτήματα Κράτησης
              <span class="badge-warn" v-if="pendingRequests.length > 0"
                >{{ pendingRequests.length }} εκκρεμή</span
              >
            </h2>
            <div class="filter-tabs">
              <button
                v-for="tab in filterTabs"
                :key="tab.value"
                :class="['tab-btn', { active: activeFilter === tab.value }]"
                @click="activeFilter = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="state-block" v-if="loading">
            <i class="ti ti-loader-2 spin" aria-hidden="true"></i>
            <span>Φόρτωση αιτημάτων...</span>
          </div>

          <div class="state-block" v-else-if="filteredRequests.length === 0">
            <i class="ti ti-inbox" aria-hidden="true"></i>
            <span>Δεν υπάρχουν αιτήματα για αυτή την κατηγορία.</span>
          </div>

          <div class="requests-list" v-else>
            <div
              v-for="req in filteredRequests"
              :key="req.id"
              :class="['request-card', 'status-' + `${req.status}`]"
            >
              <div class="status-stripe"></div>
              <div class="card-body">
                <div class="card-top">
                  <div class="requester">
                    <div class="avatar">{{ initials(req.requesterName) }}</div>
                    <div>
                      <p class="requester-name">{{ req.requesterName }}</p>
                      <p class="requester-email">{{ req.requesterEmail }}</p>
                    </div>
                  </div>
                  <span :class="['status-badge', 'badge-' + `${req.status}`]">
                    {{ statusLabel(req.status) }}
                  </span>
                </div>

                <div class="card-meta">
                  <div class="meta-item">
                    <i class="ti ti-calendar"></i>
                    <span>{{ formatDate(req.date) }}</span>
                  </div>
                  <!-- aria-hidden="true" -->
                  <div class="meta-item">
                    <i class="ti ti-clock"></i>
                    <span>{{ req.timeStart }} {{ req.timeEnd }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="ti ti-users"></i>
                    <span>{{ req.attendees }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="ti ti-tag"></i>
                    <span>{{ req.purpose }}</span>
                  </div>
                </div>

                <p class="card-notes" v-if="req.notes">{{ req.notes }}</p>

                <div class="card-files" v-if="req.files && req.files.length">
                  <p class="files-label">
                    <i class="ti ti-paperclip" aria-hidden="true"></i>
                    Συνημμένα αρχεία
                  </p>
                  <div class="files-list">
                    <a
                      v-for="file in req.files"
                      :key="file.name"
                      :href="file.url"
                      target="_blank"
                      class="file-chip"
                    >
                      <i class="ti ti-file-description" aria-hidden="true"></i>
                      {{ file.name }}
                    </a>
                  </div>
                </div>

                <div class="card-actions" v-if="req.status === 'pending'">
                  <button
                    class="btn-accept"
                    @click="handleRequest(req, 'accepted')"
                    :disabled="req.processing"
                  >
                    <i class="ti ti-check" aria-hidden="true"></i>
                    Αποδοχή
                  </button>
                  <button
                    class="btn-reject"
                    @click="handleRequest(req, 'rejected')"
                    :disabled="req.processing"
                  >
                    <i class="ti ti-x" aria-hidden="true"></i>
                    Απόρριψη
                  </button>
                </div>

                <div class="card-processed" v-else>
                  <i class="ti ti-info-circle" aria-hidden="true"></i>
                  Επεξεργάστηκε από {{ req.processedBy }} στις
                  {{ formatDate(req.processedAt) }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="no-selection" v-else>
          <i class="ti ti-building-community" aria-hidden="true"></i>
          <p>Επιλέξτε αίθουσα από τη λίστα για να εμφανιστούν τα αιτήματα</p>
        </div>
      </template>

      <!-- ══════════════════════════════════════════════════ -->
      <!-- MODE B: Lab Semester Renewal                      -->
      <!-- ══════════════════════════════════════════════════ -->
      <template v-if="activeMode === 'lab'">
        <section class="section-card">
          <div class="lab-header">
            <i class="ti ti-refresh" aria-hidden="true"></i>
            <div>
              <h2>Ανανέωση Κρατήσεων Εργαστηρίου για Νέο Εξάμηνο</h2>
              <p>
                Ο χρήστης που επιθυμεί να επαναλάβει τις κρατήσεις εργαστηρίου
                του από προηγούμενο εξάμηνο αποστέλλει αίτημα μέσω email.
                Εισάγετε τα στοιχεία που έχει αποστείλει για να επεξεργαστείτε
                το αίτημά του.
              </p>
            </div>
          </div>

          <!-- Pending email requests list -->
          <div class="email-requests" v-if="labEmailRequests.length">
            <p class="section-sublabel">
              <i class="ti ti-mail" aria-hidden="true"></i>
              Εισερχόμενα αιτήματα email
              <span class="badge-warn">{{ labEmailRequests.length }}</span>
            </p>
            <div class="email-req-list">
              <div
                v-for="er in labEmailRequests"
                :key="er.id"
                :class="[
                  'email-req-item',
                  {
                    selected:
                      labForm.email === er.email &&
                      labForm.semester === er.semester,
                  },
                ]"
                @click="prefillLabForm(er)"
              >
                <div class="email-req-avatar">
                  <i class="ti ti-mail" aria-hidden="true"></i>
                </div>
                <div class="email-req-info">
                  <span class="email-req-from">{{ er.email }}</span>
                  <span class="email-req-meta"
                    >{{ er.labName }} · {{ er.semester }}</span
                  >
                </div>
                <i
                  class="ti ti-arrow-right"
                  aria-hidden="true"
                  style="color: var(--color-text-secondary); font-size: 16px"
                ></i>
              </div>
            </div>
          </div>

          <!-- Form divider -->
          <div class="form-divider" v-if="labEmailRequests.length">
            <span>ή συμπληρώστε χειροκίνητα</span>
          </div>

          <!-- Lab renewal form -->
          <div class="lab-form">
            <div class="form-row">
              <div class="form-group">
                <label for="lab-email">
                  <i class="ti ti-mail" aria-hidden="true"></i>
                  Email χρήστη κρατήσεων
                </label>
                <input
                  id="lab-email"
                  type="email"
                  v-model="labForm.email"
                  placeholder="user@unipi.gr"
                  :class="{ 'input-error': labFormErrors.email }"
                />
                <span class="error-msg" v-if="labFormErrors.email">{{
                  labFormErrors.email
                }}</span>
              </div>

              <div class="form-group">
                <label for="lab-name">
                  <i class="ti ti-flask" aria-hidden="true"></i>
                  Όνομα εργαστηρίου
                </label>
                <div class="select-wrapper">
                  <select
                    id="lab-name"
                    v-model="labForm.labName"
                    :class="{ 'input-error': labFormErrors.labName }"
                  >
                    <option value="" disabled>— Επιλέξτε εργαστήριο —</option>
                    <option v-for="lab in labs" :key="lab" :value="lab">
                      {{ lab }}
                    </option>
                  </select>
                  <i
                    class="ti ti-chevron-down select-icon"
                    aria-hidden="true"
                  ></i>
                </div>
                <span class="error-msg" v-if="labFormErrors.labName">{{
                  labFormErrors.labName
                }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="lab-semester">
                  <i class="ti ti-calendar-stats" aria-hidden="true"></i>
                  Εξάμηνο προς αντιγραφή
                </label>
                <div class="select-wrapper">
                  <select
                    id="lab-semester"
                    v-model="labForm.semester"
                    :class="{ 'input-error': labFormErrors.semester }"
                  >
                    <option value="" disabled>— Επιλέξτε εξάμηνο —</option>
                    <option
                      v-for="s in semesters"
                      :key="s.value"
                      :value="s.value"
                    >
                      {{ s.label }}
                    </option>
                  </select>
                  <i
                    class="ti ti-chevron-down select-icon"
                    aria-hidden="true"
                  ></i>
                </div>
                <span class="error-msg" v-if="labFormErrors.semester">{{
                  labFormErrors.semester
                }}</span>
              </div>

              <div class="form-group">
                <label for="lab-target-semester">
                  <i class="ti ti-calendar-plus" aria-hidden="true"></i>
                  Νέο εξάμηνο προορισμού
                </label>
                <div class="select-wrapper">
                  <select
                    id="lab-target-semester"
                    v-model="labForm.targetSemester"
                    :class="{ 'input-error': labFormErrors.targetSemester }"
                  >
                    <option value="" disabled>— Επιλέξτε εξάμηνο —</option>
                    <option
                      v-for="s in semesters"
                      :key="s.value"
                      :value="s.value"
                    >
                      {{ s.label }}
                    </option>
                  </select>
                  <i
                    class="ti ti-chevron-down select-icon"
                    aria-hidden="true"
                  ></i>
                </div>
                <span class="error-msg" v-if="labFormErrors.targetSemester">{{
                  labFormErrors.targetSemester
                }}</span>
              </div>
            </div>

            <!-- Preview box -->
            <div
              class="preview-box"
              v-if="
                labForm.email &&
                labForm.labName &&
                labForm.semester &&
                labForm.targetSemester
              "
            >
              <i class="ti ti-info-circle" aria-hidden="true"></i>
              <p>
                Οι κρατήσεις του εργαστηρίου
                <strong>{{ labForm.labName }}</strong> από το εξάμηνο
                <strong>{{ semesterLabel(labForm.semester) }}</strong> θα
                αντιγραφούν στο εξάμηνο
                <strong>{{ semesterLabel(labForm.targetSemester) }}</strong> για
                τον χρήστη <strong>{{ labForm.email }}</strong
                >.
              </p>
            </div>

            <!-- Success message -->
            <div class="success-box" v-if="labSubmitSuccess">
              <i class="ti ti-circle-check" aria-hidden="true"></i>
              <p>Η ανανέωση ολοκληρώθηκε επιτυχώς!</p>
            </div>

            <div class="form-actions">
              <button
                class="btn-primary"
                @click="submitLabRenewal"
                :disabled="labSubmitting"
              >
                <i
                  class="ti ti-refresh"
                  aria-hidden="true"
                  v-if="!labSubmitting"
                ></i>
                <i class="ti ti-loader-2 spin" aria-hidden="true" v-else></i>
                {{ labSubmitting ? "Επεξεργασία..." : "Εκτέλεση Ανανέωσης" }}
              </button>
              <button
                class="btn-ghost"
                @click="resetLabForm"
                :disabled="labSubmitting"
              >
                <i class="ti ti-x" aria-hidden="true"></i>
                Καθαρισμός
              </button>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* ─── Layout ─────────────────────────────────────────── */
.admin-main {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ─── Page Header ─────────────────────────────────────── */
.page-header {
  padding: 1.5rem 0 0.25rem;
}
.header-inner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.header-inner > .ti-shield-check {
  font-size: 28px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}
.page-header p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* ─── Mode Switcher ───────────────────────────────────── */
.mode-switcher {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.875rem;
}
.mode-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.mode-card:hover {
  border-color: var(--color-border-secondary);
  background: var(--color-background-secondary);
}
.mode-card.active {
  border: 2px solid var(--color-border-info);
  background: var(--color-background-info);
}
.mode-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-md);
  background: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 22px;
  color: var(--color-text-secondary);
}
.mode-card.active .mode-icon {
  background: var(--color-background-primary);
  color: var(--color-text-info);
}
.mode-icon.lab {
  flex: 1;
}
.mode-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mode-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
.mode-desc {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
.mode-arrow {
  font-size: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* ─── Section Card ────────────────────────────────────── */
.section-card {
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
}

/* ─── Field label / select ────────────────────────────── */
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}
.select-wrapper {
  position: relative;
}
.select-wrapper select {
  width: 100%;
  appearance: none;
  padding-right: 2.5rem;
}
.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

/* ─── Requests Header ─────────────────────────────────── */
.requests-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.requests-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
.badge-warn {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 99px;
  background: var(--color-background-warning);
  color: var(--color-text-warning);
}
.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--color-background-secondary);
  padding: 4px;
  border-radius: var(--border-radius-md);
}
.tab-btn {
  border: none;
  background: transparent;
  padding: 5px 12px;
  font-size: 0.8125rem;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.tab-btn.active {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 0.5px solid var(--color-border-secondary);
}
.tab-btn:hover:not(.active) {
  color: var(--color-text-primary);
}

/* ─── State blocks ────────────────────────────────────── */
.state-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}
.spin {
  animation: spin 1s linear infinite;
  font-size: 22px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Request Cards ───────────────────────────────────── */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.request-card {
  display: flex;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-background-primary);
  transition: border-color 0.15s;
}
.request-card:hover {
  border-color: var(--color-border-secondary);
}
.status-stripe {
  width: 4px;
  flex-shrink: 0;
}
.status-pending .status-stripe {
  background: #ef9f27;
}
.status-accepted .status-stripe {
  background: #639922;
}
.status-rejected .status-stripe {
  background: #e24b4a;
}
.card-body {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
.requester {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-background-info);
  color: var(--color-text-info);
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.requester-name {
  font-size: 0.9375rem;
  font-weight: 500;
  margin: 0 0 2px;
  color: var(--color-text-primary);
}
.requester-email {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: 0;
}
.status-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}
.badge-pending {
  background: #faeeda;
  color: #854f0b;
}
.badge-accepted {
  background: #eaf3de;
  color: #3b6d11;
}
.badge-rejected {
  background: #fcebeb;
  color: #a32d2d;
}
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.meta-item .ti {
  font-size: 15px;
}
.card-notes {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  padding: 0.625rem 0.875rem;
  background: var(--color-background-secondary);
  border-left: 2px solid var(--color-border-secondary);
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
}
.card-files {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.files-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}
.files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  color: var(--color-text-info);
  padding: 4px 10px;
  border: 0.5px solid var(--color-border-info);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: background 0.15s;
}
.file-chip:hover {
  background: var(--color-background-info);
}
.card-actions {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.25rem;
}
.btn-accept,
.btn-reject {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 7px 16px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition:
    opacity 0.15s,
    transform 0.1s;
  border: none;
}
.btn-accept:disabled,
.btn-reject:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-accept:not(:disabled):active,
.btn-reject:not(:disabled):active {
  transform: scale(0.97);
}
.btn-accept {
  background: #eaf3de;
  color: #3b6d11;
}
.btn-accept:not(:disabled):hover {
  background: #c0dd97;
}
.btn-reject {
  background: #fcebeb;
  color: #a32d2d;
}
.btn-reject:not(:disabled):hover {
  background: #f7c1c1;
}
.card-processed {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

/* ─── No selection placeholder ────────────────────────── */
.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 1rem;
  color: var(--color-text-secondary);
  text-align: center;
}
.no-selection .ti-building-community {
  font-size: 48px;
  opacity: 0.35;
}
.no-selection p {
  font-size: 0.9375rem;
  max-width: 320px;
  margin: 0;
}

/* ─── Lab section header ──────────────────────────────── */
.lab-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.lab-header > .ti-refresh {
  font-size: 24px;
  color: var(--color-text-secondary);
  margin-top: 3px;
  flex-shrink: 0;
}
.lab-header h2 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}
.lab-header p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* ─── Email request list ──────────────────────────────── */
.section-sublabel {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 0.75rem;
}
.email-req-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1rem;
}
.email-req-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.email-req-item:hover {
  border-color: var(--color-border-secondary);
  background: var(--color-background-secondary);
}
.email-req-item.selected {
  border-color: var(--color-border-info);
  background: var(--color-background-info);
}
.email-req-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}
.email-req-item.selected .email-req-avatar {
  background: var(--color-background-primary);
  color: var(--color-text-info);
}
.email-req-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.email-req-from {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
.email-req-meta {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

/* ─── Form divider ────────────────────────────────────── */
.form-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
}
.form-divider::before,
.form-divider::after {
  content: "";
  flex: 1;
  height: 0.5px;
  background: var(--color-border-tertiary);
}

/* ─── Lab form ────────────────────────────────────────── */
.lab-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}
.input-error {
  border-color: var(--color-border-danger) !important;
}
.error-msg {
  font-size: 0.8125rem;
  color: var(--color-text-danger);
}

/* ─── Preview box ─────────────────────────────────────── */
.preview-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 0.875rem 1rem;
  background: var(--color-background-info);
  border: 0.5px solid var(--color-border-info);
  border-radius: var(--border-radius-md);
}
.preview-box > .ti-info-circle {
  font-size: 18px;
  color: var(--color-text-info);
  flex-shrink: 0;
  margin-top: 1px;
}
.preview-box p {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.6;
}

/* ─── Success box ─────────────────────────────────────── */
.success-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.875rem 1rem;
  background: var(--color-background-success);
  border: 0.5px solid var(--color-border-success);
  border-radius: var(--border-radius-md);
}
.success-box > .ti-circle-check {
  font-size: 20px;
  color: var(--color-text-success);
}
.success-box p {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-success);
  margin: 0;
}

/* ─── Form actions ────────────────────────────────────── */
.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.25rem;
  flex-wrap: wrap;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 9px 20px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-background-info);
  color: var(--color-text-info);
  border: 0.5px solid var(--color-border-info);
  transition:
    opacity 0.15s,
    transform 0.1s;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary:not(:disabled):hover {
  opacity: 0.85;
}
.btn-primary:not(:disabled):active {
  transform: scale(0.98);
}
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 9px 16px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: transparent;
  color: var(--color-text-secondary);
  border: 0.5px solid var(--color-border-secondary);
  transition: background 0.15s;
}
.btn-ghost:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-ghost:not(:disabled):hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}
</style>
