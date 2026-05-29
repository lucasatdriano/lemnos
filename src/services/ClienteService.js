import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AuthService from './AuthService';
import { toast } from 'react-toastify';
import { baseUri } from './configurations/ServiceConfig';

export async function getCliente() {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'GET',
            url: `/cliente/find`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });
        if (response.status !== 200) {
            throw new Error('Erro ao pegar dados do usuário.');
        }

        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            console.error(error.response.data.error);
        }
        throw error;
    }
}

export async function cadastrarUsuario(usuario) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: `/auth/register`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            data: {
                nome: usuario.name,
                cpf: usuario.cpf,
                email: usuario.email,
                senha: usuario.password,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            throw new Error('Erro ao cadastrar cliente.');
        }

        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error);
        }
    }
}

export async function updateCliente(cliente) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'PUT',
            url: `/cliente`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: cliente.nome,
            },
            timeout: 10000,
        });

        if (response.status != 200 && response.status != 204) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
