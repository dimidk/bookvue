<script setup>
import { ref,reactive, onMounted } from 'vue';
import axiosInstance from '../../axios';
import flatpickr from "flatpickr";
//import "flatpickr/dist/flatpickr.css";
import { compareByFieldSpecs } from '@fullcalendar/core/internal';


const props = defineProps({
    appear: String,
    bookuser: String,
    details: {
        id: String,
        title: String,
        start: String,
        end: String
    }
});

const newStartDate = ref('');
const newEndDate = ref('');

const dialog = ref(null);
const recursionFields = ref(false);  
//const emit = defineEmits(['update:details']);

onMounted( () => {

  //   flatpickr("#startDateFromCal", {
  //   enableTime: true,
  //   time_24hr: true,
  //   dateFormat: "d-m-Y H:i",
  //   defaultDate: props.details.start || null,
  //   // static: false,
  //   allowInput: true,
  //   appendTo: document.querySelector('dialog'),
  //   static: true,
  //   // appendTo: document.body
  // });
  // flatpickr("#endDateFromCal", {
  //   enableTime: true,
  //   time_24hr: true,
  //   dateFormat: "d-m-Y H:i",
  //   defaultDate: props.details.end || null,
  //   allowInput: true,
  //   appendTo: document.querySelector('dialog'),
  //   static: true,
  // });
  // flatpickr("#newStartDate", {
  //   dateFormat: "d-m-Y",
  //   allowInput: true,
  //   appendTo: document.querySelector('dialog'),
  //   static: true,
  // });
  // flatpickr("#newEndDate", {
  //   dateFormat: "d-m-Y",
  //   allowInput: true,
  //   appendTo: document.querySelector('dialog'),
  //   static: true,
  // });

  newStartDate.value;
  newEndDate.value;
 // emit('update:details'.props.details);

})

console.log("props "+ props.bookuser + " "+ props.details.start + " " +props.details.end);

  const newBooking = reactive({
    
    id: props.details.id,
    bookusername: props.bookuser,
    title: props.details.title,
    start: props.details.start.replace('T', ' '),
    end: props.details.end.replace('T', ' '),
    
    labname: '',
    
    labusername: ''

  });

  //console.log("newbooking " + props.bookuser + " " + props.details.end);

//   const newBooking = {
//     title: eventTitle.value,
//     labname: labname.value,
//     labuser: labuser.value,
//     start: eventStartDate.value,
//     end: eventEndDate.value
   
//   }
  
  
  const openDialog = () => {
    
    dialog.value.showModal();
  };

  const closeDialog = () => {
    dialog.value.close();
  };

  async function addEventForm() {

    console.log("newbooking " + newBooking.bookusername + " " + newBooking.labusername);
    console.log("detail transfer " + props.details.id + " "+ props.details.start + " " + props.details.end);
    console.log("newbooking continue data details " + newBooking.id + " " + newBooking.start + " " + newBooking.end);   

    newBooking.start = newBooking.start.slice(0,16).replace('T',' ');
    newBooking.end = newBooking.end.slice(0,16).replace('T',' ');

    if (recursionFields.value === true) {

      // let recurPostUrl = 'http://localhost:8585/api/repeat_booking/'+newStartDate.value+'/'+newEndDate.value;
      // axios.post(recurPostUrl,newBooking,{
      //   responseType: 'json',
      //   withCredentials: true
      // })
      
      let recurPostUrl = '/api/repeat_booking/'+newStartDate.value+'/'+newEndDate.value;
      let resp = await axiosInstance.post(recurPostUrl,newBooking);
      if (resp.status === 200) {
        console.log("repeated booking done");
      }
      
      let data = resp.data;

      for (const [key, valueList] of Object.entries(data)) {
      
        console.log(`Key (as string): ${key}, Value list:`, valueList);
        
        const numericKey = parseInt(key);
        console.log(`Key (as number): ${numericKey}`);

        //let strObj = JSON.stringify(valueList);

        let strObj = valueList.map(obj => 
          `title: ${obj.title},
           start: ${obj.start},
           end: ${obj.end}`).join(' ; ');
        console.log(`str obj ${strObj}`);
        
        if (numericKey === 0) {
          alert(`Your reservation conflicts with reservation: ${strObj}`);
        }

      }
      

    }
    else {  
      
      try {
        let response = await axiosInstance.post('/api/newbooking',newBooking);
        if (response.status === 200) {
          console.log("post return 200");

        }
        else {
          console.log("error in response data");
        }
        if (response.data === null) {
          alert("Cannot make reservation! Time is reserved!");
          
        }
        console.log("response data " + response.data);

      }
      catch(error) {
          console.log("error in http post new booking", error);
      }
    }

    //dialog.value.close();
    closeDialog();


  }

//   const toggleRecursionFields = () => {

//     recursionFields.value = !recursionFields.value;

//     if (recursionFields.value === 'false') {

//         recursionFields.value = 'true';

//     }
//     else {
//         recursionFields.value = 'false';
//     }
//   }
 
  defineExpose({openDialog,closeDialog});


</script>

<template>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />


<div id="create-dialog" title="Νέα Κράτηση" class="ui-helper-hidden">
    <dialog ref="dialog">
    <!-- <v-card>
        <v-card-title>text message</v-card-title>
    </v-card> -->

    <form id="create-event-form" @submit.prevent="addEventForm">
        <fieldset>
            <div>
            <input type="text" autocomplete="nope" class="text ui-widget-content ui-corner-all form-control"
            placeholder="Lesson ....." v-model="newBooking.title"/><br>
            </div>

            <div>
            <label for="startDateFromCal"><b>Έναρξη: </b></label>
            <input id="startDateFromCal" type="datetime-local" placeholder="dd-mm-yyyy" class="text ui-widget-content ui-corner-all" 
                v-model="newBooking.start" />
            </div><br>
            <div>
            <label for="endDateFromCal"><b>Λήξη: </b></label>
        <!--        <input id="endDateFromCal" type="text" />-->
            <input id="endDateFromCal" type="datetime-local" class="text ui-widget-content ui-corner-all"
                v-model="newBooking.end" />
            </div><br>
            <div>
            <label for="labname"><b>Εργαστήριο: </b></label>
            <input  type="text" placeholder="....ΔΕΠΥ Α, ΔΕΠΥ Β, ΔΕΠΥ Γ" class="text ui-widget-content ui-corner-all"
                     v-model="newBooking.labname"/>
            </div><br>
            <div>
            <label for="labuser"><b>Υπεύθυνος: </b></label>
            <input  type="text" class="text ui-widget-content ui-corner-all" 
                    v-model = "newBooking.labusername"/>
            </div><br>

            <div class="form-check my-3">
            <input
                    class="form-check-input"
                    type="checkbox"
                    id="recursionCheckbox"
                    v-model="recursionFields"    
                    
            />
            <label class="form-check-label" for="recursionCheckbox">
                Εβδομαδιαία Επανάληψη κράτησης
            </label>
            </div>

            <!-- Recursion Fields -->
            <div v-show="recursionFields" >
            <div class="mb-3">
                <label for="newStartDate"><b>Έναρξη: </b></label>
                <input type="date"
                        placeholder="Select starting date...." class="form-control" 
                        v-model="newStartDate"/>
            </div>
            <div class="mb-3">
                <label for="newEndDate"><b>Λήξη: </b></label>
                <input type="date" 
                        placeholder="Select ending date...." class="form-control" 
                        v-model="newEndDate"/>
            </div>
            </div>

            <button type="submit" @submit="addEventForm">Υποβολή</button>
            <button type="button" @click="closeDialog">Κλείσιμο</button>
            <button type="reset" >Καθαρισμός</button>

        </fieldset>
    </form>
</dialog>

</div>

</template>
<style scoped>

</style>