<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import Calendar from "./Calendar.vue";
import NavBar from "../LoginFolder/NavBar.vue";
import Header from "../LoginFolder/Header.vue";
import axiosInstance from "../../axios";
import keycloak, { getToken, isAuthenticated } from "../../auth/AuthService";
import RoomType from "./RoomType.vue";

const lab = ref([]);
const user = ref("");
const selectRoom = ref("");
const showRoom = ref("");
const showCalendar = ref(true);
const roomType = ref("Εργαστήριο");

onMounted(async () => {
  let resp = await axiosInstance.get("/labs");
  const rooms = resp.data;

  lab.value = resp.data;

  user.value = keycloak.idTokenParsed.preferred_username;
  console.log("user logged is ", user.value);
});

watch(selectRoom, (newRoom) => {
  if (newRoom) {
    showRoom.value = newRoom;
    selectRoom.value = "";

    console.log("New lab selected:", newRoom);
  }
});

// console.log("which user is logged " + user.value);
console.log(
  "which user is logged in:" + keycloak.idTokenParsed.preferred_username,
);
</script>

<template>
  <!-- v-show="showCalendar" this was in input and hides the input field when a lab is selected -->
  <br />
  <h2>Κράτηση Αίθουσας - Εργαστήριο</h2>
  <NavBar
    v-model:bookuser="keycloak.idTokenParsed.preferred_username"
    :logout="false"
  />
  <!-- <section><p><b>Χρήστης:  </b><i>{{ user }}</i></p> -->
  <section>
    <p>
      <b>Χρήστης: </b><i>{{ keycloak.idTokenParsed.preferred_username }}</i>
    </p>
    <p>
      <b
        >Εργαστήριο / Αίθουσα : <u>{{ showRoom }}</u></b
      >
    </p>
  </section>
  <section>
    <div class="nav-bar">
      <div class="nav-container">
        <input
          type="text"
          id="labnames"
          list="lab"
          placeholder="Επίλεξε Εργαστήριο - Αίθουσα"
          v-model="selectRoom"
          @click="reloadRooms"
          class="input-room"
        />
        <datalist id="lab">
          <option v-for="room in lab" :key="room">{{ room }}</option>
        </datalist>

        <!-- <button>
                <router-link v-if="selectRoom !== ''" v-show="!showCalendar" to="/calendar">Calendar</router-link>
            </button> -->
        <div class="room-type">
          <RoomType
            v-if="showRoom != '' && roomType === 'Εργαστήριο'"
            :selectedRoom="showRoom"
            :roomType="roomType"
          />
          <RoomType
            v-else="showRoom != '' && roomType === 'Αίθουσα'"
            :selectedRoom="showRoom"
            :roomType="roomType"
          />
        </div>

        <div class="calendar-container">
          <Calendar
            v-if="showRoom !== ''"
            :selectedRoom="showRoom"
            :bookuser="user"
          />
          <!-- class="calendar-container" -->
          <!-- <h4> {{ selectRoom }} </h4> -->
        </div>
      </div>
    </div>
  </section>
</template>

<!-- 
@import '../../assets/fullcalendar.css';
@import '../../assets/assets_css_fullcalendar.print.css' -->
<style scoped>
body {
  padding-top: 60px; /* Same as navbar height */
}
.nav-container {
  text-align: center;
  margin-top: 20px;
}

.input-room {
  padding: 10px;
  width: 300px;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.calendar-container {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(195, 101, 101, 0.1);
  width: 100vh;
  /*max-width: 150%;*/
  /* max-width: none; */
  /* min-height: 600px; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: top;
}
</style>
