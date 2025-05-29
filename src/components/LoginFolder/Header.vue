<script setup>
import { onMounted, ref, withDirectives } from 'vue';
import Admin from '../views/Admin.vue';
import Room from '../views/Room.vue';

//import axios from 'axios';
import axiosInstance from '../../axios';


const isAuthenticated = ref('false');
const isAdmin = ref('false');
const user = ref('');
//const loginUser = ref('ADMIN');


// const logout = () => {

// };

onMounted( async () => {

  // const resp = await axios.get('http://localhost:8585/user',{
  //   withCredentials: true
  // })
  // .then((response) => {
  //   if (response.status === 200) {
  //     console.log("query ok");
      
  //     if (response.data.role.split("-")[1] === 'ADMIN') {
  //       isAdmin.value = true;
  //     };

  //     isAuthenticated.value = true;
  //     user.value = response.data.username;

  //     console.log("user and authentication " + user.value + " " + isAuthenticated.value);
  //   }
  // })
  // .catch((error) => {
  //   console.log("error in axios get" + error);
  // });

  const resp = await axiosInstance.get('/user');
  if (resp.status === 200) {
    console.log("query OK");
  }
  let data = resp.data;
  if (data.role.split("-")[1] === 'ADMIN') {
    isAdmin.value = true;
  }
  isAuthenticated.value = true;
  user.value = data.username;
  console.log("user and authentication:", user.value,isAuthenticated.value);

});

// function logoutUser() {

//   router.push('/logout');

// }


</script>

<template>

    <!-- <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div class="container-fluid">
          <a class="navbar-brand" >Laboratory Booking</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" 
            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
                <li class="nav-item">
                  <a class="nav-link">
                      <div v-if="loginUser === 'ADMIN'">
                        <Admin v-if="loginUser === 'ADMIN'" :adminName="loginUser"/>
                      </div>
                  </a>
                </li>
            
                <li class="nav-item">
                  <a class="nav-link">
                    <Room />
                  </a>
                </li>
            </ul>
          </div>
          <div class="d-flex flex-row-reverse">
            
             <div sec:authorize="isAuthenticated()">
                  <button type="submit" class="btn btn-primary">Login</button>
                
                <div>
                  <form @submit.prevent="logout">
                    <button type="submit" class="btn btn-primary">Logout</button>

                  </form>
                </div>
              </div>
              
          </div>
      </div>
</nav> -->

<nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-item">Αρχική</router-link>
        <router-link v-if="isAuthenticated" to="/room" class="nav-item">Εργαστήριο</router-link>
        <router-link v-if="isAdmin === true" to="/admin" class="nav-item">Admin</router-link>
      </div>
      <div class="auth-buttons">
        <router-link v-if="isAuthenticated" to="/logout" class="btn">Αποσύνδεση
            <!-- <button class="btn">Logout</button> -->
        </router-link>
        <router-link v-else to="/login" class="btn">Σύνδεση</router-link>
      </div>
    </nav>
    <!-- {{ isAuthenticated }}
    {{ isAdmin }}  -->

<!-- <NavBar /> -->


</template>

<style scoped>

.navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: #bb6060;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }
    
    /* Navigation Container */
    .nav-container {
        display: flex;
        gap: 15px;
    }
    
    /* Navigation Links */
    .nav-item {
        color: white;
        text-decoration: none;
        font-size: 18px;
        font-weight: bold;
        padding: 10px;
        transition: color 0.3s ease;
    }
    
    .nav-item:hover {
        color: #1e90ff;
    }
    
    /* Auth Buttons */
    .auth-buttons {
        display: flex;
        gap: 10px;
    }
    
    .btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s ease;
    }
    
    .btn:hover {
        background: #0056b3;
    }
    
    /* Push Page Content Below Navbar */
    body {
        padding-top: 60px; /* Same as navbar height */
    }

</style>