<script setup>
import { onMounted, ref, reactive, useTemplateRef } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactivePlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import CreateDialog from '../popups/CreateDialog.vue';
import EventDetails from '../popups/EventDetails.vue';
import HelpPage from '../popups/HelpPage.vue';

//import { render } from '@fullcalendar/core/preact.js';
import axiosInstance from '../../axios';

const props = defineProps({
    selectedRoom: String,
    bookuser: String
})


const details = reactive({
    id:'',
    bookusername: props.bookuser,
    labname: props.selectedRoom,
    title: '',
    start: '',
    end: '',
    labusername:''
});

const eventDetails = reactive({
    id: '',
    title: '',
    start: '',
    end: ''
});
const text = ref('');
const dialog = ref(null);
const dialogDet = ref(null);
const dialogManual = ref(null);
const isAdmin = ref('false');

const calendarPlugins = [dayGridPlugin,timeGridPlugin,interactivePlugin];
const emit = defineEmits(['update:selectedRoom']);

const url = '/labs/'+props.selectedRoom;
const fullcalendar = ref(null);
let calAPI = null;
const childRef = useTemplateRef('dialog');


onMounted(async () => {

    calAPI = fullcalendar.value.getApi();
    dialog.value;
    dialogDet.value;
    dialogManual.value;

    emit('update:selectedRoom', props.selectedRoom);
    //calAPI.render();

    const resp = await axiosInstance.get('/user');
    if (resp.status === 200) {
      let data = resp.data;
      let role = data.role;
      
      if (role === '[ROLE_ADMIN]') {
          isAdmin.value = 'true';
      };
      
    }

});



async function changeTimeSlot(arg) {

    console.log(arg.event.id + " "+arg.event.title+" "+arg.event.startStr);

    let recordBook = {
        bookusername: props.bookuser,
        labname: props.selectedRoom,
        id: arg.event.id,
        title: arg.event.title,
        start: arg.event.startStr.slice(0,16).replace('T', ' '),
        end: arg.event.endStr.slice(0,16).replace('T', ' '),
    }

    console.log("all info about modified event "+ recordBook.start +" "+recordBook.end);

    try {
        let response = await axiosInstance.post('/api/findBooking',recordBook);
        if (response.status === 200) {
            console.log("request ok");
        }
        else {
                console.log("problem with request");
        }

        console.log("record found with data "+response.data.bookusername);
        let data = response.data;

        // 
        if (recordBook.bookusername !== data.bookusername && isAdmin.value === 'false') {
            alert("You are not authorized to change time in this event!");
        //    calAPI.render();

        }
        else {

            recordBook = {
                bookusername: data.bookusername,
                labname: data.labname,
                id: data.id,
                title: data.title,
                start: data.start.slice(0,16).replace('T', ' '),
                end: arg.event.endStr.slice(0,16).replace('T', ' '),
            }
            console.log(recordBook.bookusername,recordBook.id,recordBook.labname,recordBook.start,recordBook.end);


            let reqUrl = '/api/updateTime/'+data.id
            let response = await axiosInstance.post(reqUrl,recordBook);
            if (response.status === 200) {
                console.log("request ok");
                console.log("update event is done!");
            }
            else {
                    console.log("problem with GET request");
            }

        }

    }
    catch(error) {
        console.log("error in Axios Post",error);
    }

};




async function showDetails(arg) {
    console.log("show objct " + arg);
    let idtest = arg.event.id;
    console.log("event id "+idtest);

    console.log("show details " + arg.event.id + " " + arg.event.title +" "+arg.event.start);
    console.log("emitted selected Room ",props.selectedRoom);

    text.value = arg.event.title;
    details.id = arg.event.id;
    details.title = arg.event.title;
    details.start = arg.event.startStr.slice(0,16).replace('T', ' ');
    console.log("show details start date in string and bookusername " + details.start + " "+details.bookusername+" "+details.labname);
    details.end = arg.event.endStr.slice(0,16).replace('T', ' ');
    details.labname = props.selectedRoom;

    let response = await axiosInstance.post('/api/findBooking',details);

    if (response.status === 200) {
        console.log("ok request");
    }
    console.log(response.data);
    let data = response.data;

    details.id = data.id;
    details.bookusername = data.bookusername;
    details.labname = data.labname;
    details.title = data.title;
    details.start = data.start;
    details.end = data.end;
    details.labusername = data.labusername;



    if (dialogDet.value) {
        dialogDet.value.openDialog();
    }

}

function deletingEvent(arg) {

    //showDetails(arg);
    alert("Under Construction....");

}

function underConstruction(arg) {

    

}

const showComments = (arg) => {
    console.log(arg);
}

async function addingNewEvent(arg) {
    console.log(arg);

    try {
        let resp = await axiosInstance.get('/api/all');
        if (resp.status === 200) {
            console.log("ok");
        }            
        console.log(resp.data);
        eventDetails.id = Math.floor(resp.data)+1;

    }
    catch {
        console.log("there is an error in request ");
    }

   
    
    eventDetails.title = arg.title;
    eventDetails.start = arg.startStr.slice(0,19);
    eventDetails.end = arg.endStr.slice(0,19);

    console.log("details prop " + eventDetails.id + " " +eventDetails.start + " " +eventDetails.end);

    dialog.value.openDialog();
}

const newBooking = () => {
    dialog.value.openDialog();
}

const showManual = () => {

    dialogManual.value.openDialog();
  //dialog.value.openDialog();
}

</script>




<template>
<!-- <section>
    <h4>
       {{ bookuser }}
    </h4>
</section> -->
    
 <CreateDialog ref="dialog" :bookuser="bookuser" :details="eventDetails"/>
 <EventDetails ref="dialogDet" v-if="text !== ''" :bookuser="bookuser" :event="details"/>
 <HelpPage ref="dialogManual" />
 <section>
    <button @click="newBooking" class="btn"><i>Νέα Κράτηση</i></button>
    <hr>
    <button @click="deletingEvent" class="btn"><i>Διαγραφή Κράτησης</i></button>
    <hr>
    <button @click="showManual" class="btn"><i>Εγχειρίδιο Χρήσης</i></button>
 </section>
  
    <FullCalendar ref="fullcalendar"
             
             :options="{
                 initialView: 'timeGridWeek',
                 plugins: [timeGridPlugin,dayGridPlugin,interactivePlugin,listPlugin],
                 headerToolbar: {
                     left: 'listWeek,timeGridWeek',
                     center: 'title',
                     right: 'prev today next'
                 },
                 
                 selectable: true,
                 selectOverlap: false,
                 selectConstraint: {
                     start: '00:01',
                     end: '23:59'
                 },
                 eventDurationEditable: true,
                 slotMinTime: '08:00',
                 slotMaxTime: '20:00',
                 height: 'auto',
                 width: 'auto',
                 events: async (info, successCallback, failureCallback) => {
                    try {
                        const response = await axiosInstance.get(`/labs/${props.selectedRoom}`);
                        const events = response.data.map(event => ({
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end
                        }));
                        successCallback(events);
                    } catch (error) {
                        console.error('Error fetching events:', error);
                        failureCallback(error);
                    }
                 },
                 eventOverlap: false,
                 select: addingNewEvent,
                 eventClick: showDetails,
                 eventChange: changeTimeSlot,
                 eventAdd: test,
                 eventDrop: deletingEvent,
                 renderEvent: showComments
             }"
               />
 




</template>
<style scoped>
@import '../../assets/fullcalendar.css';
@import '../../assets/assets_css_fullcalendar.print.css';

</style>