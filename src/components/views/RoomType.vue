<script setup>
import {  ref, reactive, useTemplateRef,watch } from "vue";


import axiosInstance from "../../axios";

const props = defineProps({
  selectedRoom: String,
  roomType: String,
});

const roomData = reactive({
  labName: "",
  type: "",
  tm: "",
  seats: "",
});

const emit = defineEmits([
  "update:selectedRoom",
  "update:roomType",
]);


const fetchRoomData = async () => {
  try {
    let resp = await axiosInstance.get("/roomDescription/" + props.roomType + "/" + props.selectedRoom);
    if (resp.status === 200) {
      let data = resp.data;
      console.log("data from room request ",data);
      
      roomData.labName = data.labName;
      roomData.type = data.type;
      roomData.tm = data.tm;
      roomData.seats = data.seats;
    }
  } catch (error) {
    console.error("Error fetching room data:", error);
  }
};

watch(
  () => [props.selectedRoom, props.roomType],
  async ([newSelectedRoom, newRoomType]) => {
    // Only fetch if both values exist
    if (newSelectedRoom && newRoomType) {
      emit("update:selectedRoom", newSelectedRoom);
      emit("update:roomType", newRoomType);
      await fetchRoomData();
    }
  },
  { immediate: true } // This will run immediately on component mount
);



</script>
<template>
  <br />
  <h5>{{ props.roomType }}</h5>

  <!-- <section><p><b>Χρήστης:  </b><i>{{ user }}</i></p> -->
  <section>
    <p>
    <div class="room">
      <b>
        <!-- {{ props.roomType }} : <u><i>{{ props.selectedRoom }}</i></u> -->
        <u><i>{{ props.selectedRoom }}</i></u>
      </b>
      <section>
        <span>τετραγωνικά μέτρα: {{ roomData.tm }}</span
        ><br />
        <span>θέσεις: {{ roomData.seats }}</span>
      </section>
    </div>
    </p>
  </section>
</template>
<style scoped>
.room {
  padding: 10px;
  width: 300px;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-left: auto;
  margin-right: auto;
}
</style>
