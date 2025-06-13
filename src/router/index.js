import { createRouter, createWebHistory } from 'vue-router';
import StartPage from '../components/StartPage.vue';
// import Login from '../components/LoginFolder/Login.vue';
import Logout from '../components/LoginFolder/Logout.vue';
import Register from '../components/LoginFolder/Register.vue';
import Room from '../components/views/Room.vue';
import Calendar from '../components/views/Calendar.vue';
import Header from '../components/LoginFolder/Header.vue';

const routes = [
  { path: '/', component: StartPage },
  // { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/register', component: Register },
  { path: '/header', component: Header },
  { path: '/room', component: Room },
  { path: '/calendar', component: Calendar }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // This will automatically redirect to Keycloak
    await initKeycloak();
    return false;
  }
});

export default router;
 