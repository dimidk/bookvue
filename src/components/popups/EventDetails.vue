<script setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import axiosInstance from '../../axios';
// import "flatpickr/dist/flatpickr.css";

const props = defineProps({
    event: {
        id: String,
        bookusername: String,
        labname: String,
        title: String,
        start: String,
        end: String,
        labusername: String
    },
    bookuser: String
})

const title = ref('');
const start = ref('');
const end = ref('');

const eventToShow = reactive({

    id: props.event.id,
    title: props.event.title,
    start: props.event.start.slice(0,16).replace('T',' '),
    end: props.event.end.slice(0,16).replace('T',' '),
    labname: props.event.labname,
    bookusername: props.event.bookusername,
    labusername: props.event.labusername

})

const dialog=ref(null);


// onMounted( () => {
//     flatpickr(eventToShow.start, {
//     enableTime: true,
//     time_24hr: true,
//     dateFormat: "d-m-Y H:i",
//     defaultDate: eventToShow.start || null,
//     // static: false,
//     allowInput: true,
//     appendTo: document.querySelector('dialog'),
//     static: true,
//     // appendTo: document.body
//   });
//   flatpickr("#endDateFromCal", {
//     enableTime: true,
//     time_24hr: true,
//     dateFormat: "d-m-Y H:i",
//     defaultDate: eventToShow.end || null,
//     allowInput: true,
//     appendTo: document.querySelector('dialog'),
//     static: true,
//   });
//   flatpickr("#newStartDate", {
//     dateFormat: "d-m-Y",
//     allowInput: true,
//     appendTo: document.querySelector('dialog'),
//     static: true,
//   });
//   flatpickr("#newEndDate", {
//     dateFormat: "d-m-Y",
//     allowInput: true,
//     appendTo: document.querySelector('dialog'),
//     static: true,
//   });
// })

const openDialog = async () => {

    await nextTick();
    if (dialog.value) {
        dialog.value.showModal();
    }
    else {
        console.log("dialog is null");
    }
  };

const closeDialog = () => {

    if (dialog.value)
        dialog.value.close();
};

watch(props.event, (newEventToShow) => {

    if (newEventToShow) {

        console.log(newEventToShow);
    }

    console.log(props.event.bookusername);
    console.log(props.event.id);
    console.log(props.event.title);
    console.log(props.event.start.slice(0,16).replace('T',' '));
    console.log(props.event.end.slice(0,16).replace('T',' '));
    console.log(props.event.labname);
    console.log(props.event.labusername);

    console.log("new event to show details");
    console.log(newEventToShow.title);
    console.log(newEventToShow.start);
    console.log(newEventToShow.end);

    eventToShow.id = newEventToShow.id;
    eventToShow.title = newEventToShow.title;
    eventToShow.start = newEventToShow.start.slice(0,16);
    eventToShow.end = newEventToShow.end.slice(0,16);
    eventToShow.labname = newEventToShow.labname;
    eventToShow.bookusername = newEventToShow.bookusername;
    eventToShow.labusername = newEventToShow.labusername;

    console.log("logged user", props.bookuser);
    if (eventToShow.bookusername === props.bookuser) {
      console.log("change authorizeToDelete value");
       
    }

    console.log(eventToShow);

},
{ immediate: true});


function updateEvent(arg) {


    if (props.bookuser !== eventToShow.bookusername) {
        alert("You are not authorized to update the event");
    }
    else {

    
        if (title.value !== '') {

            eventToShow.title = title.value; 
            console.log("change only the title, so the date is the same",eventToShow.start,eventToShow.end);

            updateTitle();
        }
        
            
        if (start.value !== '' && end.value !== '') {

            console.log("change only date, so title is the same ", eventToShow.title);

            let timeStart = eventToShow.start.split(' ')[1];
            let timeEnd = eventToShow.end.split(' ')[1];
            console.log("old time event ",timeStart,timeEnd);
            console.log("updaste titile",title);

            console.log("start date from ui ",start,end);

            let startStr = start.value;
            startStr = startStr + " " + timeStart;
            let endStr = end.value;
            endStr = endStr+" "+ timeEnd;
            console.log("updated date with time:",startStr,endStr);
            

            eventToShow.start = startStr;
            eventToShow.end = endStr;

            updateDate();
        }

        console.log("event that is going to be updated ",eventToShow.id, eventToShow.bookusername,eventToShow.labusername);
        console.log("event with updated datetime",eventToShow.start,eventToShow.end);
       

    }

    title.value = '';
    start.value = '';
    end.value = '';
    closeDialog();

}

async function updateTitle() {

    let reqUrl = '/api/updateTitle/'+eventToShow.id;
    console.log("eventToShowChanges",eventToShow.title,eventToShow.labusername,eventToShow.bookusername);
    console.log(eventToShow.start,eventToShow.end,eventToShow.labname);

    let response = await axiosInstance.post(reqUrl,eventToShow);

    if (response.status === 200) {
        console.log("title updated");
    }
    if (response.statusText === 'BAD_REQUEST') {
        console.log("title wasn't changed!");
    }

    console.log(response.data);
}


async function updateDate() {

    let retvalue = 0;

    let reqUrl = '/api/updateDate/'+eventToShow.id;

    console.log("eventToShowChanges",eventToShow.title,eventToShow.labusername,eventToShow.bookusername);
    console.log(eventToShow.start,eventToShow.end,eventToShow.labname);

    let response = await axiosInstance.post(reqUrl,eventToShow);
    if (response.status === 200) 
        console.log("date updated");

    if (response.statusText === 'BAD_REQUEST') {

        retvalue = -1;
        console.log("date is overlaped and can not be changed!");
        alert("date is reserved! The change can not be done!");
    }

    console.log(response.data);

    return retvalue;
}




async function deleteEvent() {

    try {
        let response = await axiosInstance.post('/api/delete',eventToShow);
        if (response.status === 200) {
            console.log("Http Request OK");
        }
        else {
            console.log("Http Request problem");
        }
        let data = response.data;
        console.log("response bookuser and eventToDelete bookuser "+ data.bookusername + " " + props.event.bookusername);
        console.log("response data id and eventToShow id",data.id,eventToShow.id);

        if (data.bookusername !== props.bookuser) {
            alert("You are not authorized to delete");
        }

    }
    catch(error) {
        console.log("error in fetching deletion data ", error);
    }

    closeDialog();

}

  defineExpose({openDialog,closeDialog});
//   this was in the template showing the logged user that books events {{ bookuser }}
</script>

<template>
    <div>
        <dialog ref="dialog" v-if="event">
            
        <fieldset>
           <h3>Λεπτομέρειες Κράτησης</h3>
           
            <fieldset>
                <b>  Τίτλος:</b> {{ eventToShow.title }}
            </fieldset>
            <fieldset>
                <b>  Έναρξη: </b>{{ eventToShow.start }}
            </fieldset>
            <fieldset>
                <b>  Λήξη: </b>{{ eventToShow.end }}
            </fieldset>

            <fieldset>
                <b>  Κράτηση από: </b> {{ eventToShow.bookusername }}
            </fieldset>
            <fieldset>
                <b>  Εργαστήριο: </b> {{ eventToShow.labname }}
            </fieldset>
            <fieldset>
                <b>  Υπεύθυνος: </b> {{ eventToShow.labusername }}
            </fieldset>
        
        </fieldset>
        <hr>
        <form @submit.prevent="updateEvent">
        <fieldset>
            <legend>Ενημέρωση Κράτησης</legend>
            <div>
                <label for="changeInfo">Αλλαγή Περιγραφής/Τίτλου: </label>
                <input id="changeInfo" type="text" placeholder="....αλλαγή περιγραφής..." v-model="title">
            </div>
            <div>
                <label for="changeDateStart">Αλλαγή Ημερομηνίας Έναρξης: </label>
                <input id="changeDateStart" type="date" v-model="start">
            </div>
            <div>
                <label for="changeDateEnd">Αλλαγή Ημερομηνίας Λήξης: </label>
                <input id="changeDateEnd" type="date" v-model="end">
            </div>
            
            <div>
                <button type="submit" >Ενημέρωση</button>
                <!-- <button type="submit" @click="updateEvent">Update</button> -->
                <button type="button" @click="deleteEvent">Διαγραφή</button>
                <button type="button" @click="closeDialog">Κλείσιμο</button>
            </div>
        </fieldset>
    </form>
    </dialog>
    </div>


</template>