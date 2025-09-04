<script setup>
import { ref } from 'vue';
import NavBar from './NavBar.vue';
import keycloak, { isAuthenticated, getToken, LogOut } from '../../auth/AuthService';

// defineProps({
//     logout: true
// })

// const logout = ref(true);

//const logout = () => keycloak.logout({redirectUri: "http://localhost:9090/realms/devrealm/protocol/openid-connect/logout?"});


const logout = LogOut();

</script>

<template>
<div>
    <h2>Ο χρήστης αποσυνδέθηκε επιτυχώς!</h2>
    <!-- <router-link v-if="logout === true" to="/login">Login</router-link> -->
       <NavBar v-model:logout="logout"/>
</div>
    

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