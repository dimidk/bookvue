<script setup>
import { ref, reactive, onMounted } from "vue";
import axiosInstance from "../../axios";
import flatpickr from "flatpickr";
//import "flatpickr/dist/flatpickr.css";
import { compareByFieldSpecs } from "@fullcalendar/core/internal";

const props = defineProps({
  appear: String,
  bookuser: String,
  details: {
    //id: String,
    title: String,
    start: String,
    end: String,
    labclassname: String,
  },
});

const newStartDate = ref("");
const newEndDate = ref("");

const dialog = ref(null);
// const rentList = ref(["Καθημερινή: 1200 ευρώ", "Σαββατοκύριακο: 1500 ευρώ"]);
//const emit = defineEmits(['update:details']);

onMounted(() => {
  newStartDate.value;
  newEndDate.value;
  // emit('update:details'.props.details);
});

console.log(
  "props " +
    props.bookuser +
    " " +
    props.details.start +
    " " +
    props.details.end,
);

const newRenting = reactive({
  id: props.details.id,
  rentuser: props.bookuser,
  title: props.details.title,
  start: props.details.start.replace("T", " "),
  end: props.details.end.replace("T", " "),
  labclassname: props.details.labclassname,
  // fileDetails: "",
  price: "",
  rentAuthor: "",
});

const fileDetails = reactive({
  filename: "",
  filesize: "",
  contenttype: "",
  zipfile: "",
});

const openDialog = () => {
  dialog.value.showModal();
};

const closeDialog = () => {
  dialog.value.close();
};

async function uploadFiles() {
  let uploadUrl = "/rent/" + newRenting.id + "/upload";
  try {
    let resp = await axiosInstance.post(uploadUrl, newRenting.fileDetails);
    if (resp.status === 200) {
      console.log("post return 200");
    } else {
      console.log("error in response data");
    }
    if (resp.data === null) {
      alert("Cannot upload files!");
    }
    console.log("response data " + resp.data);
  } catch (error) {
    console.log("error in http post uploading", error);
  }
}

async function rentEventForm() {
  console.log(
    "newrenting " +
      newRenting.rentuser +
      " " +
      newRenting.rentAuthor +
      " " +
      newRenting.price,
  );
  console.log(
    "detail transfer " +
      //   props.details.id +
      " " +
      props.details.start +
      " " +
      props.details.end,
  );

  newRenting.start = newRenting.start.slice(0, 16).replace("T", " ");
  newRenting.end = newRenting.end.slice(0, 16).replace("T", " ");

  console.log("filename to upload ", newRenting.fileDetails);

  try {
    let response = await axiosInstance.post("/rent/newrenting", newRenting);
    if (response.status === 200) {
      console.log("post return 200");
    } else {
      console.log("error in response data");
    }
    if (response.data === null) {
      alert("Cannot make reservation! Time is reserved!");
    }
    console.log("response data " + response.data);
  } catch (error) {
    console.log("error in http post new booking", error);
  }

  //dialog.value.close();
  closeDialog();
}

defineExpose({ openDialog, closeDialog });
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
  />

  <dialog ref="dialog" class="small-dialog">
    <div class="dialog-container">
      <button class="close-btn" @click="closeDialog">×</button>

      <h2 class="dialog-title">Νέα Ενοικίαση</h2>

      <div class="form-section">
        <h3>Συμπλήρωση στοιχείων</h3>
        <form id="rent-event-form" @submit.prevent="rentEventForm">
          <div class="form-group">
            <input
              type="text"
              autocomplete="nope"
              class="form-control"
              placeholder="Rent for ....."
              v-model="newRenting.title"
            />
          </div>

          <div class="form-group">
            <label for="startDateFromCal"><b>Από: </b></label>
            <input
              id="startDateFromCal"
              type="datetime-local"
              class="form-control"
              v-model="newRenting.start"
            />
          </div>

          <div class="form-group">
            <label for="endDateFromCal"><b>Μέχρι: </b></label>
            <input
              id="endDateFromCal"
              type="datetime-local"
              class="form-control"
              v-model="newRenting.end"
            />
          </div>

          <div class="form-group">
            <label for="rentAuthor"><b>Υπεύθυνος/Εταιρεία: </b></label>
            <input
              type="text"
              class="form-control"
              v-model="newRenting.rentAuthor"
            />
          </div>

          <div class="form-group">
            <label for="price"><b>Τιμή: </b></label>
            <select
              name="rentlist"
              class="form-control"
              v-model="newRenting.price"
            >
              <option value="default_option">---</option>
              <option data-val="Καθημερινή: 1200" value="1200">
                Καθημερινή: 1200 ευρώ
              </option>
              <option data-val="Σκ: 1800" value="1800">
                Σαββατοκύριακο: 1800 ευρώ
              </option>
            </select>
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">Υποβολή</button>
            <!-- <button
              type="button"
              class="btn btn-secondary"
              @click="closeDialog"
            >
              Κλείσιμο
            </button> -->
            <button type="reset" class="btn btn-secondary">Καθαρισμός</button>
          </div>
        </form>
      </div>

      <hr class="section-divider" />

      <div class="upload-section">
        <h3>Κατάθεση Δικαιολογητικών</h3>
        <form
          method="post"
          enctype="multipart/formdata"
          @submit.prevent="uploadFiles"
        >
          <div class="form-group">
            <label for="rentDetails"><b>Δικαιολογητικά: </b></label>
            <input
              type="file"
              name="files"
              accept="text/*"
              size="10MB"
              class="form-control file-input"
              v-on:change="fileDetails"
            />
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Αποστολή</button>
            <button type="reset" class="btn btn-secondary">
              Διαγραφή αρχείου
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.small-dialog {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  padding: 0;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  background: white;
  overflow: hidden;
}

.small-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-container {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  font-weight: bold;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

/* Dialog title */
.dialog-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
}

/* Sections */
.form-section,
.upload-section {
  margin-bottom: 20px;
}

.form-section h3,
.upload-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #555;
  font-weight: 600;
}

/* Form groups */
.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.1);
}

.file-input {
  padding: 8px;
  background: #f9f9f9;
  cursor: pointer;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-primary {
  background: #4a90d9;
  color: white;
}

.btn-primary:hover {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 144, 217, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #555;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Divider */
.section-divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
}

/* Scrollbar styling */
.dialog-container::-webkit-scrollbar {
  width: 6px;
}

.dialog-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dialog-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.dialog-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* Responsive */
@media (max-width: 600px) {
  .small-dialog {
    width: 95%;
    max-width: 100%;
    margin: 10px;
  }

  .dialog-container {
    padding: 16px;
  }

  .btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>
