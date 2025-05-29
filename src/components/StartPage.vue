<script setup>
// import Login from './LoginFolder/Login.vue';
// import Register from './LoginFolder/Register.vue';

    const link="http://localhost:8585/registeredUsers";

 

</script>

<template>
    <h1>Κράτηση Εργαστηρίων - Αιθουσών</h1>
  
    <div>
        <button><router-link to="/login">Σύνδεση</router-link></button>
        <!-- <button><a href="http://www.noc.ntua.gr/Shibboleth.sso/Login?target=http%3A//www.noc.ntua.gr&amp;forceAuthn=true">Σύνδεση</a></button> -->
        <button>
            <router-link to="/register">Εγγραφή</router-link>
        </button>
    </div>
    <div>
        <a :href="link">Για εγγεγραμμένους χρήστες</a>
    </div>
    
    
  
    <!-- <div class="container">
        <button @click="login">Login</button>
        <button @click="register">Register</button>
        
    </div> -->
    <!-- <Login />
    <Register /> -->

</template>