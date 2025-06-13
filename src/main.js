import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { initKeycloak } from './services/auth';

const app = createApp(App);

// Initialize Keycloak before mounting the app
initKeycloak().then(() => {
  app.use(router);
  app.mount('#app');
}).catch(() => {
  console.error('Authentication failed');
});



// createApp(App)
// .use(router)

// .mount('#app')
