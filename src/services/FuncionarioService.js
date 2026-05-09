import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AuthService from './AuthService';
import { toast } from 'react-toastify';
import { baseUri } from './configurations/ServiceConfig';

export async function getFuncionarioByToken() {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/funcionario/me`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi encontrar o funcionario');
        }
        return response.data;
    } catch (error) {
        toast.error(error, {
            position: "bottom-right"
        });
    }
}

export async function getFuncionarioByEmail(email) {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/funcionario/find?email=${email}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi encontrar o funcionario');
        }
        return response.data;
    } catch (error) {
        toast.error(error, {
            position: "bottom-right"
        });
    }
}

export async function getFuncionarioByNome(nome) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: '/funcionario/by',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: nome,
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi encontrar o funcionario');
        }

        return response.data;
    } catch (error) {
        toast.error(error, {
            position: "bottom-right"
        });
    }
}

export async function getFuncionarios() {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/funcionario`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status != 200) {
            throw new Error('Não foi possível listar os funcionarios');
        }
        return response.data;
    } catch (error) {
        toast.error(error, {
            position: "bottom-right"
        });
    }
}

export async function cadastrarFuncionario(funcionario, tipoEntidade) {
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
                nome: funcionario.nome,
                cpf: funcionario.cpf,
                telefone: funcionario.telefone,
                dataNascimento: funcionario.dataNasc,
                dataAdmissao: funcionario.dataAdmissao,
                email: funcionario.email,
                senha: funcionario.senha,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            return false;
        }
        toast.success('Funcionário cadastrado', {
            position: "bottom-right"
        });

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

export async function updateFuncionario(funcionario) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'PUT',
            url: `/funcionario`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: funcionario.nome,
                telefone: funcionario.telefone,
                dataNascimento: funcionario.dataNasc,
                dataAdmissao: funcionario.dataAdmissao,
                senha: funcionario.senha,
            },
            params: {
                email: funcionario.email,
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

export async function excluirFuncionario(email) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'DELETE',
            url: `/funcionario`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            params: {
                email: email,
            },
        });

        if (response.status != 200) {
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
