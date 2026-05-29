import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AuthService from './AuthService';
import { toast } from 'react-toastify';
import { baseUri } from './configurations/ServiceConfig';

export async function cadastrarFornecedor(fornecedor, tipoEntidade) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: `/auth/register/${tipoEntidade}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: fornecedor.nome,
                cnpj: fornecedor.cnpj,
                telefone: fornecedor.telefone,
                email: fornecedor.email,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            return false;
        }
        toast.success('Fornecedor cadastrado');

        return true;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error);
        }
        return false;
    }
}

export async function getFornecedorByEmail(email) {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/fornecedor/find?email=${email}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi encontrar o fornecedor');
        }
        return response.data;
    } catch (error) {
        toast.error(error);
    }
}

export async function getFornecedores() {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/fornecedor`,
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi possível listar os fornecedores');
        }
        return response.data;
    } catch (error) {
        toast.error(error);
    }
}

export async function getFornecedoresByNome(fornecedor) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: '/fornecedor/by',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            params: {
                nome: fornecedor,
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi possível listar os fornecedores');
        }
        return response.data;
    } catch (error) {
        toast.error(error);
    }
}

export async function updateFornecedor(fornecedor) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'PUT',
            url: `/fornecedor`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: fornecedor.nome,
                cnpj: fornecedor.cnpj,
                telefone: fornecedor.telefone,
            },
            params: {
                email: fornecedor.email,
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
            toast.error(error.response.data.error);
        }
        return false;
    }
}
