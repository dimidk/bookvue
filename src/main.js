import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { initKeycloak } from './auth/AuthService';

const app = createApp(App);
// const kc = initKeycloak();


// Initialize Keycloak before mounting the app
// kc.then(() => {
//   app.use(router);
//   app.mount('#app');
// }).catch(() => {
//   console.error('Authentication failed');
// });

initKeycloak().then(() => {
  app.use(router);
  app.mount('#app');
}).catch(() => {
  console.error('Authentication failed');
});



// createApp(App)
// .use(router)

// .mount('#app')
