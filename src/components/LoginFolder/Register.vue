<script setup lang="ts">
import { reactive } from 'vue';
//import axios from 'axios';
import axiosInstance from '../../axios';
import router from '../../router';
import type { User }  from '../../types/types';




// const username = ref('');
// const email = ref('');
// const fullname = ref('');
const userObj = reactive<User>({
    username: '',
    email: '',
    fullname: '',
    password: 'nobody',
    role: 'ROLE_USER'
});

// const userobj = ref<User>({
// {username: username,
//     email: email,
//     fullname: fullname

// }

// });


// const data = {
//     username: username,
//     email: email,
//     fullname: fullname

// };

const registerForm = async () => {

    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    
    console.log("data for posting: " + userObj.email + " " + userObj.password+" " + userObj.role);

    // await axios.post('http://localhost:8585/auth/register',userObj,{
    //     withCredentials: true
    // });

    await axiosInstance.post('/auth/register',userObj);

    //router.push('/login');
    router.push('/room');
};

const checkingEmail =() => {

    // if (!email.value.trim().includes('mail.ntua')
    //  && !email.value.trim().includes('central')) {
    //     alert("giving wrong type of email!");
    //     console.log("wrong email");
    //     email.value = '';
    // }
    if (!userObj.email.trim().includes('mail.ntua')
     && !userObj.email.trim().includes('central')) {
        alert("giving wrong type of email!");
        console.log("wrong email");
        userObj.email = '';
    }

};

const checkingUsername = () => {

    // if (username.value.trim().startsWith('el') ||
    // username.value.trim().startsWith('cv') ||
    // username.value.trim().startsWith('mm') ||
    // username.value.trim().startsWith('nm') ||
    // username.value.trim().startsWith('mc') ||
    // username.value.trim().startsWith('mcp') ||
    // username.value.trim().startsWith('ar') ||
    // username.value.trim().startsWith('ch') ||
    // username.value.trim().startsWith('rs')) {
    //     alert("this email is not accepted!");
    //     username.value = '';
    // }
    if (userObj.username.trim().startsWith('el') ||
    userObj.username.trim().startsWith('cv') ||
    userObj.username.trim().startsWith('mm') ||
    userObj.username.trim().startsWith('nm') ||
    userObj.username.trim().startsWith('mc') ||
    userObj.username.trim().startsWith('mcp') ||
    userObj.username.trim().startsWith('ar') ||
    userObj.username.trim().startsWith('ch') ||
    userObj.username.trim().startsWith('rs')) {
        alert("this username is not accepted!");
        userObj.username = '';
    }
}


</script>

<template>
    <div class="login-container">
        <h2>Register</h2>
        <form @submit.prevent="registerForm">
            <div class="form-group">
            <label for="username">Όνομα χρήστη</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" 
                    v-model="userObj.username" @blur="checkingUsername">
            </div>
            <div class="form-group">
            <label for="email">Ιδρυματικό Email</label>
            <input type="text" id="email" name="email" placeholder="Enter your edu email"
                     @blur="checkingEmail" v-model="userObj.email">
            </div>
            <div class="form-group">
            <label for="fullname">Ονοματεπώνυμο</label>
            <input type="text" id="fullname" name="fullname" placeholder="....επώνυμο όνομα....." 
                    v-model="userObj.fullname">
            </div>
      
            <div class="flex-group">
            <button type="submit">Εγγραφή</button>
            <button type="reset">Καθαρισμός</button>
        
            </div>
         
        </form>
        <!-- <div th:if="${param.error}" class="message error">
            <p>Invalid username or password. Please try again.</p>
        </div>
        <div th:if="${param.logout}" class="message success">
            <p>You have been logged out successfully.</p>
        </div> -->
    </div>
</template>

<style scoped>
    body {
        font-family: Poppins, sans-serif;
        background-color: #f4f4f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        }
        .login-container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 300px;
        text-align: center;
        }
        .login-container h2 {
        color: #333333;
        margin-bottom: 20px;
        }
        .form-group {
        margin-bottom: 15px;
        text-align: left;
        }
        .form-group label {
        display: block;
        font-size: 14px;
        color: #666666;
        margin-bottom: 5px;
        }
        .form-group input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 5px;
        }
        .form-group input:focus {
        border-color: #0066cc;
        outline: none;
        }
        .form-group button {
        width: 100%;
        padding: 10px;
        background-color: #0066cc;
        color: #ffffff;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        }
        .form-group button:hover {
        background-color: #004a99;
        }
        .message {
        margin-top: 15px;
        font-size: 14px;
        }
        .message.error {
        color: #cc0000;
        }
        .message.success {
        color: #00a500;
        }
</style>