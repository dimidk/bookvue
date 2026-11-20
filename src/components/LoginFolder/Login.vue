<template>
  <div>Redirecting to login...</div>
</template>

<script setup>
import { onMounted } from "vue";
import keycloak, { initKeycloak } from "../../auth/AuthService";

onMounted(async () => {
  const authenticated = await initKeycloak();
  if (!authenticated) {
    keycloak.login({
      redirectUri: window.location.origin + "/callback",
      idpHint: "shibboleth", // your Shibboleth IdP alias in Keycloak
    });
  }
});
</script>
