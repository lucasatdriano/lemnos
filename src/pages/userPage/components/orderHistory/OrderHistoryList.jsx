import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { listarPedido } from '../../../../services/UsuarioProdutoService';
import { getProdutoById } from '../../../../services/ProdutoService';

import Loading from '../../../../components/layout/loading/Loading';

import OrderHistoryCard from './OrderHistoryCard';

import './orderHistory.scss';

export default function OrderHistoryList({ onOpenPedidoModal }) {
    const navigate = useNavigate();

    const [mostrarMais, setMostrarMais] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pedidos, setPedidos] = useState([]);

    async function fetchPedidos() {
        setLoading(true);

        try {
            const pedidosResponse = await listarPedido();

            if (!pedidosResponse?.length) {
                setPedidos([]);
                return;
            }

            const pedidosDetalhados = await Promise.all(
                pedidosResponse.map(async (pedido) => {
                    const items = pedido.descricao.split('\n').filter(Boolean);

                    const detalhesProdutos = await Promise.all(
                        items.map(async (item) => {
                            const [idProduto, quantidade] = item.split(', ');

                            const detalhesProduto =
                                await getProdutoById(idProduto);

                            return {
                                id: idProduto,
                                quantidade: Number(quantidade),
                                ...detalhesProduto,
                            };
                        })
                    );

                    return {
                        ...pedido,
                        produtos: detalhesProdutos,
                    };
                })
            );

            setPedidos(pedidosDetalhados);
        } catch (error) {
            console.error('Erro ao obter pedidos', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPedidos();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!pedidos.length) {
        return (
            <div className="orderHistoryContainer ordersEmpty">
                <h3>Nenhum pedido encontrado</h3>

                <p>Você ainda não realizou nenhuma compra.</p>

                <button
                    type="button"
                    className="buyProductsButton"
                    onClick={() => navigate('/productFilter')}
                >
                    Ver Produtos
                </button>
            </div>
        );
    }

    return (
        <div className="orderHistoryContainer">
            <ul className="listItens">
                {pedidos
                    .slice(0, mostrarMais ? pedidos.length : 3)
                    .map((pedido) => (
                        <OrderHistoryCard
                            key={pedido.id}
                            pedido={pedido}
                            onClick={() => onOpenPedidoModal?.(pedido)}
                        />
                    ))}
            </ul>

            {!mostrarMais && pedidos.length > 3 && (
                <button
                    type="button"
                    className="mostMoreButton"
                    onClick={() => setMostrarMais(true)}
                >
                    Mostrar Mais
                </button>
            )}
        </div>
    );
}

OrderHistoryList.propTypes = {
    onOpenPedidoModal: PropTypes.func,
};
