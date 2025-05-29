import axios from 'axios';

const API_BASE_URL = "http://147.102.246.150:8585/auth";

class AuthService {
    
    register(user) {
        return axios.post(`${API_BASE_URL}/register`, user);
    }

    login(user) {
        return axios.post(`${API_BASE_URL}/login`, user);
    }
}

export default AuthService;