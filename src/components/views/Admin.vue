<script setup>
import { onMounted, reactive } from 'vue';
import keycloak, {getToken, isAuthenticated} from '../../auth/AuthService';
import axiosInstance from '../../axios';

defineProps({
    adminName: String
});

const adminName = reactive('');
if (isAdmin) {
    adminName = 'admin';
}

onMounted( () => {

    
})


</script>

<template>

<div class="btn-group-vertical btn-group-sm" role="group" aria-label="author button">

    <h3>OnLine Booking App Administration </h3>
    <div class="btn-group-sm" v-if="isAdmin" >
        <button type="button">Administrator {{ adminName }}</button>
    </div><hr>

    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <div class="login-container">
                        <h4>Loading Last Year/Semester Bookings</h4><hr>
                    <!--   th:action="@{/loadLastYear}"         -->
                        <form >

                            <div class="form-group">
                                <label for="adminusername">Select user</label>
                                <!-- <input type="text" id="adminusername" name="adminusername" placeholder="Enter your username" list="usernames" required>
                                <datalist id="usernames">
                                    <option th:each="user : ${users}"  th:text="${user}"></option>
                                </datalist> -->
                            </div><br>

                            <div class="form-group">
                                <label for="adminlabname">Select lab</label>
                                <!-- <input type="text" id="adminlabname" name="adminlabname" placeholder="Enter the lab name" list="labs" required>
                                <datalist id="labs">
                                    <option th:each="lab : ${labs}"  th:text="${lab}"></option>
                                </datalist> -->
                            </div><br>

                            <div class="form-group">
                                <label for="startSemesterDate"><b>Έναρξη Εξαμήνου: </b></label>
                                <input type="date" id="startSemesterDate" name="startSemesterDate" required />
                            </div><br>

                            <div class="form-group">
                                <button type="submit" id="loadForm" >Load</button>
                                <button type="reset">Reset</button>
                            </div>
                        
                        </form>

                        <!-- <div th:if="${param.error}" class="message error">
                            <p>Invalid username or password. Please try again.</p>
                        </div>
                        <div th:if="${param.logout}" class="message success">
                            <p>You have been logged out successfully.</p>
                        </div> -->
                </div>
            </div>

            <!-- <div class="col-md-6 ">
            <div>
                <h4>Backing up database information</h4><br><hr>
            </div>
            <form th:action="@{/exportDatabase}" method="post">
                <div class="form-group">
                <label for="exportDatabase">Export Database </label>
                <input type="email" id="exportDatabase" name="exportDatabase" placeholder="Given Database">
                </div><br>
                <div class="form-group">
                <button type="submit" class="btn-group-sm">Submit</button>
                </div>
            </form>
            </div> -->
        </div>
    </div>
</div>

</template>
