<script setup lang="ts">
import { reactive, ref }  from 'vue';
import Error from './Error.vue';
import router from '../../router';
import type { User } from '../../types/types';
//import axios from 'axios';
import axiosInstance from '../../axios';
//import auth from '../../auth/AuthService';
// import AuthService from '../../auth/AuthService';


const userObj = reactive<User>({
    username: '',
    email: '',
    fullname: '',
    password: 'nobody',
    role: 'ROLE_USER'
});


    // const username = ref('');
    // const email = ref('');
    const errorMessage = ref('');

    // const loginApiRequest = "http://localhost:8585/api/login/";
    
    // const user = {
    //     username: username.value,
    //     email: email.value
    // }

    async function loginForm() {

        if (userObj.email.trim() === '' && userObj.email.trim() === '') {
            console.log("no correct data");
            errorMessage.value  = 'Invalid username or password';
            router.push('/login');
        }
        else {
             try {
            //     const response = await fetch(loginApiRequest, {
            
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify(userObj)
            //     });

            //     if (!response.ok) {
            //         console.log("error with fetching user");
                     
            //     }
            //     const data = await response.json();
            //     user = data.map((d) => d.username);
                

            //    const data = await axios.post(loginApiRequest,userObj);
               console.log("user obj:" + userObj.username + " " + userObj.email+" " +userObj.role);
            //    let response   = await axios.post("http://localhost:8585/auth/login",userObj,
            //    {
            //     responseType: 'json',
            //     withCredentials: true
            //    });

               let response   = await axiosInstance.post('/auth/login',userObj);

               if (response.status === 200) {
                console.log("http request ok!");

                let data = response.data;
                console.log("Login request response:"+data.id + " "+data.username + " "+data.role);

                router.push('/header');
               }
               else {
                console.log("problem with request");
               }
               
            }
            catch {

                errorMessage.value = "error in fetching!";
            } ;
                
    

        }

    };
</script>

<template>
 
    <div class="login-container">
        <h2>Σύνδεση</h2>
        <form @submit.prevent="loginForm">
            <div class="form-group">
            <label for="username">Όνομα χρήστη</label>
            <input type="text" id="username" name="username" placeholder="....όνομα χρήστη..." 
                    v-model="userObj.username">
            </div>
            <div class="form-group">
            <label for="email">Email</label>
            <input type="text" id="email" name="email" placeholder="...ιδρυματικό email..." 
                    v-model="userObj.email">
            </div>
            <div class="flex-group">
            <button type="submit">Σύνδεση</button>
            </div>
        </form>

        <!-- <div th:if="${param.error}" class="message error">
            <p>Invalid username or password. Please try again.</p>
        </div>
        <div th:if="${param.logout}" class="message success">
            <p>You have been logged out successfully.</p>
        </div> -->
</div>

<Error v-if="errorMessage !== ''" :message="errorMessage"/>
</template>

<style scoped>
    body {
        font-family: Helvetica, sans-serif;
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
        color: #0f33d3;
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
        border-color: #0066bc;
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
        background-color: #036317;
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