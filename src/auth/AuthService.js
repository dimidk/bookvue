
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:9090/',
  realm: 'devrealm',
  clientId: 'book-client'
});

export const initKeycloak = async () => {
  console.log("initializing Keycloak....")
  try {
    console.log("Authentication functioning")
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      redirectURI: window.location.origin // Redirect to Keycloak login
      // pkceMethod: 'S256',
      // checkLoginIframe: false
    });

    if (!authenticated) {
      console.warn("Not authenticated!");
      await keycloak.login();
    }

    return keycloak;
  } catch (error) {
    console.error("Authentication Failed", error);
    throw error;
  }
};


export const updateToken = (successCallback) => {
  keycloak.updateToken(2).then(successCallback).catch(doLogin);}

export const doLogin = keycloak.login;

export const isLoggedIn = () => !!keycloak.token;
export const LogOut = () => keycloak.logout({redirectUri: "https://147.102.246.150:5173"});



export default keycloak;
export const getToken = () => keycloak.token;
export const isAuthenticated = () => !!keycloak.token;
// export const logout = () => keycloak.logout({ redirectUri: "http://localhost:5173/logout" });