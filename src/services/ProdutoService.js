import axios from 'axios';
import AuthService from './AuthService';
import { baseUri } from './configurations/ServiceConfig';
import { toast } from 'react-toastify';

export async function listarProdutosFiltrados(filtro, page, size) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: '/produto/find',
            withCredentials: true,
            data: {
                nome: filtro.nome,
                categoria: filtro.categoria,
                subCategoria: filtro.subCategoria,
                marca: filtro.marca,
                menorPreco: filtro.menorPreco,
                maiorPreco: filtro.maiorPreco,
                avaliacao: filtro.avaliacao,
                page: page,
                size: size,
            },
            timeout: 10000,
        });

        if (response.status !== 200 && response.status !== 204) {
            throw new Error('Erro ao filtrar produtos.');
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

export async function listarProdutosComDesconto() {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'GET',
            url: '/produto/desconto',
            timeout: 10000,
        });

        if (response.status !== 200 && response.status !== 204) {
            throw new Error('Erro ao listar produtos com desconto.');
        }

        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            toast.error(error.response.data.error, {
                position: 'bottom-right',
            });
        } else {
            toast.error('Erro ao listar produtos.', {
                position: 'bottom-right',
            });
        }
        throw error;
    }
}

export async function cadastrarProduto(produto) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'POST',
            url: '/produto',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: produto.nome,
                valor: produto.valor,
                descricao: produto.descricao,
                desconto: produto.desconto,
                cor: produto.cor,
                modelo: produto.modelo,
                imagemPrincipal: produto.imagemPrincipal,
                imagens: produto.imagens,
                subCategoria: produto.subCategoria,
                peso: produto.peso,
                altura: produto.altura,
                comprimento: produto.comprimento,
                largura: produto.largura,
                fabricante: produto.fabricante,
                fornecedor: produto.fornecedor,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            throw new Error(response);
        }

        return true;
    } catch (error) {
        console.error(error);
    }
}

export async function updateProduto(produto, id) {
    try {
        const response = await axios({
            baseURL: baseUri,
            method: 'PUT',
            url: `/produto/${id}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                nome: produto.nome,
                valor: produto.preco,
                descricao: produto.descricao,
                desconto: produto.desconto,
                fornecedor: produto.fornecedor,
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
            console.error(error.response.data.error);
        }
        return false;
    }
}

export async function getProdutoById(id) {
    try {
        const response = await axios({
            baseURL: baseUri,
            url: `/produto/${id}`,
            timeout: 10000,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter detalhes do produto:', error);
        return null;
    }
}
