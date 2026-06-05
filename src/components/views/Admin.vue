<script setup>
import { onMounted, reactive, ref } from "vue";
import NavBar from "../LoginFolder/NavBar.vue";
import keycloak, {
  getToken,
  isAuthenticated,
  LogOut,
} from "../../auth/AuthService";
import axiosInstance from "../../axios";

const adminName = ref("");
const details = reactive({
  bookusername: "",
  labname: "",
});

adminName.value = keycloak.idTokenParsed.preferred_username;

onMounted(async () => {
  const resp = await axiosInstance.get("/user");
  let data = resp.data;
  console.log("username role ", data.username, data.role);
  if (resp.status === 200) {
    console.log("HTTP request OK");

    if (data.role.includes("ADMIN")) {
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
</script>

<template>
  <NavBar
    v-model:bookuser="keycloak.idTokenParsed.preferred_username"
    :logout="false"
  />
  <section class="section">
    <h3>Administrator Jobs</h3>
  </section>

  <section class="section">
    <p>
      Ο διαχειριστής έχει την δυνατότητα να ενημερώσει το νέο εξάμηνο με τις
      ίδιες κρατήσεις των εργαστηρίων από το προηγούμενο εξάμηνο. Αυτό μπορεί να
      γίνει όταν ο χρήστης που κάνει τις κρατήσεις στείλει σε mail το όνομά του
      καθώς και το όνομα του εργαστηρίου για το οποίο θέλει να δεσμευτούν οι
      ίδιες ημέρες και ώρες του εργαστηρίου στο νέο εξάμηνο. Επίσης ο
      διαχειριστής έχει την δυνατότητα της διαγραφής όλων των κρατήσεων.
    </p>
  </section>

  <section class="section">
    <form @submit.prevent="updateLabNewSemester">
      <fieldset>
        <legend>Ενημέρωση Εργαστηρίου Νέου Εξαμήνου</legend>
        <div>
          <label for="bookusername">Όνομα book user: &nbsp;&nbsp;</label>
          <input
            id="bookusername"
            type="text"
            placeholder="....όνομα χρήστη κρατήσεων..."
            v-model="details.bookusername"
          />
        </div>
        <div>
          <label for="labname">Όνομα Εργαστηρίου: &nbsp;&nbsp;</label>
          <input
            id="labname"
            type="text"
            placeholder=".....ΔΕΠΥ Α ή ΔΕΠΥ Β ή ΔΕΠΥ Γ"
            v-model="details.labname"
          />
        </div>

        <div>
          <button type="submit">Αποστολή</button>

          <!-- <button type="button" @click="deleteEvent">Διαγραφή</button>
                <button type="button" @click="closeDialog">Κλείσιμο</button> -->
        </div>
      </fieldset>
    </form>
  </section>
</template>
