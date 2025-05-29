<script setup>
import { ref } from 'vue';
// import { defineProps } from 'vue';

defineProps({
    message: String
});

// const message = ref('Invalid Username or Password!');

</script>

<template>
    <div v-if="message" class="error-message">
        {{ message }}
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