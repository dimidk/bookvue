
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
<<<<<<< HEAD
  url: 'https://keycloak-dev:9090/',
  realm: 'devrealm',
  clientId: 'book-client'
=======
  //  url: 'https://keycloak-dev:9090/',
   url: 'https://sso.it.ntua.gr/',
  //  realm: 'devrealm',
   realm: 'booking',
  clientId: 'book-client',
  clientSecret: 'R2dFV@V*4bHVv9d8'
>>>>>>> https-keycloak
});

export const initKeycloak = async () => {
  console.log("initializing Keycloak....")

  try {
    console.log("Authentication functioning")
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      flow: 'standard',
      redirectUri: 'https://147.102.246.150:5173',
      //onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      
    });
    

    console.log("this for getting email ",keycloak.tokenParsed?.sub);

    console.log(authenticated ? 'Authenticated' : 'Problem with authentication');

    if (!authenticated) {
      console.warn("Not authenticated!");
      await keycloak.login();
    }
    // else {
    //   const mytoken = keycloak.tokenParsed;
    //   console.log("user returned :",{
    //     mail: mytoken.email,
    //     username: mytoken.preferred_username
    //   });
    // }
    // return authenticated;

    console.log("username",keycloak.tokenParsed.preferred_username);
    console.log("email:", keycloak.tokenParsed?.email);
    
     return keycloak;
  } catch (error) {
    const tokenInEr = keycloak.tokenParsed;
    console.error("Authentication Failed", error);
    console.log(keycloak.tokenParsed.preferred_username);
    console.log(keycloak.tokenParsed);
    console.log(tokenInEr.iss,tokenInEr.aud,tokenInEr.sub);
    console.log(keycloak.tokenParsed.iat);

    throw error;
  }
};


export const updateToken = (successCallback) => {
  keycloak.updateToken(2).then(successCallback).catch(doLogin);}

// export const updateToken = ( successCallback: (refreshed boolean ) => void ) => 
//   keycloak.updateToken(30).then(successCallback).catch(doLogin);


// export const updateToken = (successCallback) => {
//   if (!keycloak.authenticated) {
//     doLogin();
//     return;
//   }
//   keycloak.updateToken(30).then(successCallback).catch(doLogin);
// };

export const doLogin = keycloak.login;

// export const doLogin = () => keycloak.login({
//   redirectUri: window.location.origin + '/callback',
//   idpHint: 'shibboleth'

// });

export const isLoggedIn = () => !!keycloak.token;
export const LogOut = () => keycloak.logout({redirectUri: "https://147.102.246.150:5173"});
// export const LogOut = () => keycloak.logout({redirectUri: "https://147.102.75.206:5173"});
// export const LogOut = () => keycloak.logout({redirectUri: "https://:5173"});



export default keycloak;
// export const getToken = () => keycloak.token;

export const getToken = () => {
  if (!keycloak.token) {
    console.warn("No token yet — user not authenticated");
    return null;
  }
  return keycloak.token;
};

export const isAuthenticated = () => !!keycloak.token;
// export const logout = () => keycloak.logout({ redirectUri: "http://localhost:5173/logout" });E