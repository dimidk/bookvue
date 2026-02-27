<script setup>
import axiosInstance from '../../axios';
import { onMounted, ref } from 'vue';


const dialog = ref(null);

const openDialog = () => {

    if (dialog.value) {
        dialog.value.showModal();
    }
    else {
        console.log("dialog is null");
    }
}

const closeDialog = ()  => {

    if (dialog.value) {
        dialog.value.close();
    }
}

function deleteRecords() {

    
    



}

defineExpose({openDialog,closeDialog});

</script>
<template>
    <div>
        <dialog ref="dialog">

            <form @submit.prevent="deleteRecords">
                <fieldset>
                    <legend>Διαγραφή Κράτησης</legend>
                    <div>
                        <label for="changeInfo">Τίτλος Κράτησης: </label>
                        <input id="changeInfo" type="text" placeholder="....περιγραφής..." v-model="title">
                    </div>
                    <div>
                        <label for="deleteDateStart">Ημερομηνίας Έναρξης: </label>
                        <input id="deleteDateStart" type="date" v-model="start">
                    </div>
                    <div>
                        <label for="deleteDateEnd">Ημερομηνίας Λήξης: </label>
                        <input id="deleteDateEnd" type="date" v-model="end">
                    </div>
                    
                    <div>
                        <!-- <button type="submit" >Διαγραφή</button> -->
                        <!-- <button type="submit" @click="updateEvent">Update</button> -->
                        <button type="button" @click="deleteRecords">Διαγραφή</button>
                        <button type="button" @click="closeDialog">Κλείσιμο</button>
                    </div>

                </fieldset>

            </form>

        </dialog>
    </div>

</template>
<style scoped>

</style>