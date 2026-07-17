import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AuthService from './AuthService';
import { API_BASE_URL } from './configurations/ServiceConfig';

export async function login(usuario, navigate) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/auth/login',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            data: {
                email: usuario.email,
                senha: usuario.password,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao fazer login do usuário.');
        }

        AuthService.setToken(response.data.token);

        setTimeout(
            () => {
                AuthService.logout();
                navigate('/auth');
            },
            45 * 60 * 1000
        );

        return true;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return false;
    }
}

export async function loginFirebase(token) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/auth/login-firebase',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            data: {
                token: token,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao fazer login do usuário.');
        }

        AuthService.setGoogleToken(token);
        AuthService.setToken(response.data.token);

        await new Promise((resolve) => setTimeout(resolve, 100));

        return true;
    } catch (error) {
        console.error('Erro ao fazer login com firebase:', error);

        return false;
    }
}
