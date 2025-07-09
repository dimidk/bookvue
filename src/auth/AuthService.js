
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
      onLoad: 'login-required' // Redirect to Keycloak login
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


export default keycloak;
export const getToken = () => keycloak.token;
export const isAuthenticated = () => !!keycloak.token;
// export const logout = () => keycloak.logout({ redirectUri: "http://localhost:5173/logout" });