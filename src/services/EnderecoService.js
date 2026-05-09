import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AuthService from './AuthService';
import { toast } from 'react-toastify';
import { baseUri } from './configurations/ServiceConfig';

export async function verificarCep(cep) {
    try {
        const response = await axios.get(
            `https://viacep.com.br/ws/${cep}/json/`
        );
        if (response.data.erro) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar o CEP:', error);
        return false;
    }
}

export async function getEnderecoFromCep(cep) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'GET',
            url: `/endereco`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            params: {
                cep: cep,
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            return false;
        }

        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error, {
                position: "bottom-right"
            });
        }
        return false;
    }
}

export async function cadastrarEndereco(emailEntidade, endereco, tipoEntidade) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: `/endereco`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                email: emailEntidade,
                cep: endereco.cep,
                numeroLogradouro: endereco.nLogradouro,
                complemento: endereco.complemento,
                entidade: tipoEntidade,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            return response.data;
        }

        return true;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error, {
                position: "bottom-right"
            });
        }
        return false;
    }
}

export async function updateEndereco(emailEntidade, endereco, TipoEntidade) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'PUT',
            url: '/endereco',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                email: emailEntidade,
                cep: endereco.cep,
                numeroLogradouro: endereco.numLogradouro,
                complemento: endereco.complemento,
                entidade: TipoEntidade,
            },
            timeout: 10000,
        });

        if (response.status != 200 && response.status != 204) {
            return false;
        }

        return true;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error, {
                position: "bottom-right"
            });
        }
        console.error(error);
        return false;
    }
}

export async function excluirEndereco(email, cep, entidade) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'DELETE',
            url: '/endereco',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            params: {
                email: email,
                cep: cep,
                e: entidade.replace("ROLE_", "").toLowerCase(),
            },
            timeout: 10000,
        });

        if (response.status != 200 && response.status != 204) {
            return false;
        }

        return true;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error, {
                position: "bottom-right"
            });
        }
        return false;
    }
}
