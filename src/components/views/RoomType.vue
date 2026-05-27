<script setup>
import { onMounted, ref, reactive, useTemplateRef } from "vue";

import CreateDialog from "../popups/CreateDialog.vue";
import EventDetails from "../popups/EventDetails.vue";
import HelpPage from "../popups/HelpPage.vue";
import DeleteDialog from "../popups/DeleteDialog.vue";

//import { render } from '@fullcalendar/core/preact.js';
import axiosInstance from "../../axios";

const props = defineProps({
  selectedRoom: String,
  roomType: String,
});

const emit = defineEmits(["update:selectedRoom", "update:roomType"]);
const url = "/labs/" + props.selectedRoom;

onMounted(() => {
  emit("update:selectedRoom", props.selectedRoom);
  emit("update:roomType", props.roomType);
  //calAPI.render();

  // const resp = await axiosInstance.get(url);
  // if (resp.status === 200) {
  //     let data = resp.data;

  // };
});
</script>
<template>
  <br />
  <h2>{{ props.roomType }}</h2>

  <!-- <section><p><b>Χρήστης:  </b><i>{{ user }}</i></p> -->
  <section>
    <p>
      <b>
        {{ props.roomType }} : <u>{{ props.selectedRoom }}</u>
      </b>
    </p>
  </section>
</template>
<style scoped></style>
