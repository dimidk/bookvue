<template>
  <div>Completing login...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { initKeycloak } from "../../auth/AuthService";

const router = useRouter();

onMounted(async () => {
  await initKeycloak();
});
</script>
