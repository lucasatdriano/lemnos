import { API_BASE_URL } from './configurations/ServiceConfig';
import cartEventEmitter from './configurations/events';
import AuthService from './AuthService';
import axios from 'axios';

export async function listarProdutosFiltrados(filtro, page, size) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/produto/find',
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
            timeout: 25000,
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
            baseURL: API_BASE_URL,
            method: 'GET',
            url: '/produto/desconto',
            timeout: 25000,
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
            console.error(error.response.data.error);
        }
        throw error;
    }
}

export async function listarProdutosFavoritos() {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: `/favorito`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao adicionar favorito.');
        }

        if (response.status == 401) {
            return false;
        }

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function adicionarFavorito(produto) {
    if (AuthService.isLoggedIn()) {
        try {
            const response = await axios({
                baseURL: API_BASE_URL,
                method: 'POST',
                url: '/favorito',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: AuthService.getToken(),
                },
                params: {
                    id_prod: produto.id,
                },
                timeout: 10000,
            });

            if (response.status !== 200) {
                throw new Error('Erro ao adicionar favorito.');
            }

            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export async function desfavoritarProduto(produto) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'DELETE',
            url: '/favorito',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            params: {
                id_prod: produto.id,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao remover favorito.');
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function avaliarProduto(produto, valorAvaliacao) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: `/produto/avaliar/${produto.id}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                avaliacao: valorAvaliacao,
            },
            timeout: 10000,
        });

        if (response.status != 201) {
            throw new Error('Erro ao avaliar produto.');
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

export async function listarCarrinho() {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: '/carrinho',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao listar carrinho.');
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

export async function getQuantidadeCarrinho() {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: '/carrinho/quantidade',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
        });

        if (response.status == 401) {
            AuthService.logout();
            return;
        }
        if (response.status !== 200) {
            throw new Error(
                'Erro ao obter quantidade de produtos no carrinho.'
            );
        }

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function adicionarProdutoCarrinho(produto, qntd) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/carrinho/adicionar',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                id: produto.id,
                quantidade: qntd,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao adicionar produto ao carrinho.');
        }

        cartEventEmitter.emit('produtoAdicionado');
        cartEventEmitter.emit('updateCart');
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

export async function removerProdutoCarrinho(produto, qntd) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/carrinho/remover',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                id: produto.id,
                quantidade: qntd,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao remover produto do carrinho.');
        }

        cartEventEmitter.emit('produtoAdicionado');
        cartEventEmitter.emit('updateCart');
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

export async function apagarCarrinho() {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'DELETE',
            url: '/carrinho/tudo',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao apagar carrinho.');
        }

        cartEventEmitter.emit('produtoAdicionado');
        cartEventEmitter.emit('updateCart');
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

export async function novoPedido(pedido) {
    console.error('enviou');
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'POST',
            url: '/pedido',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                metodoPagamento: pedido.metodoPagamento,
                valorPagamento: pedido.valorPedido,
                valorFrete: pedido.fretePedido,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao fazer pedido.');
        }

        cartEventEmitter.emit('updateCart');
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

export async function listarPedido() {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: `/pedido`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao listar pedido.');
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

export async function pedidoPorId(id) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: `/pedido/${id}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao listar pedido.');
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

export async function getPedido(pedido) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'GET',
            url: `/pedido/${pedido}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao adicionar método de pagamento.');
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

export async function atualizarStatus(pedido) {
    try {
        const response = await axios({
            baseURL: API_BASE_URL,
            method: 'PUT',
            url: '/pedido',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: AuthService.getToken(),
            },
            data: {
                id: pedido,
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error('Erro ao atualizar status do pedido.');
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
