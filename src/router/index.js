import { createRouter, createWebHistory } from 'vue-router';
import StartPage from '../components/StartPage.vue';
// import Login from '../components/LoginFolder/Login.vue';
import Logout from '../components/LoginFolder/Logout.vue';
import Register from '../components/LoginFolder/Register.vue';
import Room from '../components/views/Room.vue';
import Calendar from '../components/views/Calendar.vue';
import Header from '../components/LoginFolder/Header.vue';
import Admin from '../components/views/Admin.vue';
import keycloak, { getToken, initKeycloak, isAuthenticated } from '../auth/AuthService';

//changes to redirect to application. So far just logged in. I want to have a token and with this token to navigate between vues
//change the StartPage to be the Header page, but want to navigate to other pages. When logged in to Header page user logged in. 
//when try to other pages user must sign in, that is because there is no authentication to other vues.
//this must be done from the backend and authenticate and authorize.

const routes = [
  // { path: '/', component: StartPage },
  { path: '/', component: Room },
  // { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/register', component: Register },
  // { path: '/header', component: Header },
  { path: '/admin', component: Admin },
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
    // initKeycloak();
    return false;
  }
  else {
    var tokenValue = getToken();
    console.log("token is ",tokenValue);
    var auth = isAuthenticated()
    console.log("authenticated is ", auth.toString());

    console.log("refresh token ", keycloak.refreshToken);
    console.log("user id from keycloak ",keycloak.idToken);

    console.log("token attributes ", keycloak.idTokenParsed.acr);
    console.log("token attributes ", keycloak.idTokenParsed.amr);
    console.log("token attributes ", keycloak.idTokenParsed.aud);
    console.log("token attributes authentication time ", keycloak.idTokenParsed.auth_time);
    console.log("token attributes ", keycloak.idTokenParsed.azp);
    console.log("token attributes expires ", keycloak.idTokenParsed.exp);
    console.log("token attributes ", keycloak.idTokenParsed.iat);
    console.log("token attributes ", keycloak.idTokenParsed.iss);
    console.log("token attributes ", keycloak.idTokenParsed.resource_access);
  }

});

export default router;
 