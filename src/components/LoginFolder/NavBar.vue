<script setup>
  import { onMounted ,onUpdated,ref } from 'vue';
  //import axios from 'axios';
  import axiosInstance from '../../axios';
  import Error from './Error.vue';
  import keycloak, { getToken, isAuthenticated} from '../../auth/AuthService';

  const props = defineProps({
    bookuser: String,
    logout: false
  })

  const isAdmin = ref('false');

  
  //emit is to update the parent and child component with the bookuser property
  const emit = defineEmits(['update:bookuser']);

  // const isAuthenticated = ref('false');
  // const auth = ref('false');

  onMounted( async () => {

    // const resp = await axios.get('http://localhost:8585/user',{
    // withCredentials: true
    // })
    // .then((response) => {
    // if (response.status === 200) {
    //   console.log("query ok");
      
    //   if (response.data.role.split("-")[1] === 'ADMIN') {
    //     isAdmin.value = true;
    //   };

    //   console.log("response data from ok http " + response.data.username + " " + response.data.role);

    //   isAuthenticated.value = true;
    //   emit('update:bookuser', response.data.username);
    // }
    // })
    // .catch((error) => {
    // console.log("error in axios get" + error);
    // });
    const resp = await axiosInstance.get('/user');
    if (resp.status === 200) {
      console.log("HTTP request OK");

      let data = resp.data;
      let role = data.role;
      
      if (role === '[ROLE_ADMIN]') {
          isAdmin.value = 'true';
      };
      console.log("response data from ok http " + data.username + " " + data.role);
      console.log("isAdmin is "+isAdmin.value)
      
      emit('update:bookuser', data.username);

    }
    else {
      //keycloak.clearToken();
      keycloak.logout();
      //keycloak.redirectUri("http://localhost:5173/logout");
    }
    
   
  });
// const auth  = ref('');

// if (keycloak.authenticated) {
//   auth.value = true;
// }
// else {
//   auth.value = false;
// }

const auth = ref(keycloak.authenticated);

console.log("user logged in that is in props in NavBar ",props.bookuser,keycloak.authenticated,auth.value);

</script>


<template>
  <!-- <h2>You are logged in</h2> -->
   <!-- <h4>{{ bookuser }}</h4> -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-item" >Αρχική</router-link>
        <!-- <router-link v-if="isAdmin === 'true'" to="/admin" class="nav-item" v-model:adminName="keycloak.idTokenParsed.preferred_username"
                            :administrator="true">Administrator</router-link> -->
        <router-link v-if="isAdmin === 'true'" to="/admin" class="nav-item">Administrator</router-link>
      </div>
      <div class="auth-buttons">
        <!-- <button v-if="isAuthenticated" @click="logout" class="btn">Logout</button> -->
         <!-- <router-link v-if="auth === true && logout === false" to="/logout" class="btn">Αποσύνδεση</router-link> -->
        <router-link v-if="isAuthenticated() && logout === false" to="/logout" class="btn">Αποσύνδεση</router-link>  
        <router-link  v-else to="/login" class="btn">Σύνδεση</router-link>
      </div>
    </nav>
    
  </template>
  

  
  <style scoped>
  /* Fixed Top Navigation Bar */
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
  