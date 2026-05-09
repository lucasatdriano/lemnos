/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import OrderModal from '../modals/orderModal/OrderModal';
import './order.scss';
import { listarPedido } from '../../../../services/UsuarioProdutoService';
import { getProdutoById } from '../../../../services/ProdutoService';
import Loading from '../../../../components/loading/Loading';
import { useNavigate } from 'react-router-dom';

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export default function historicoCompras() {
    const BRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const navigate = useNavigate();

    const [mostrarMais, setMostrarMais] = useState(false);
    const [compraSelecionada, setCompraSelecionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pedidos, setPedidos] = useState([]);

    async function fetchPedidos() {
        setLoading(true);

        try {
            const pedidosResponse = await listarPedido();

            if (!pedidosResponse || pedidosResponse.length === 0) {
                setPedidos([]);
                return;
            }

            const pedidosDetalhados = await Promise.all(
                pedidosResponse.map(async (pedido) => {
                    const descricao = pedido.descricao;

                    const items = descricao.split('\n').filter(Boolean);

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

    const handleToggleMostrar = () => {
        setMostrarMais(!mostrarMais);
    };

    const handleAbrirModal = (pedido) => {
        setCompraSelecionada(pedido);
    };

    if (loading) {
        return <Loading />;
    }

    if (!pedidos.length) {
        return (
            <div className="containerHistory emptyOrders">
                <h3>Nenhum pedido encontrado</h3>
                <p>Você ainda não realizou nenhuma compra.</p>
                <button
                    type="button"
                    className="btnComprar"
                    onClick={() => navigate('/productFilter')}
                >
                    Ver Produtos
                </button>
            </div>
        );
    }

    return (
        <div className="containerHistory">
            <>
                {pedidos
                    .slice(0, mostrarMais ? pedidos.length : 3)
                    .map((pedido, index) => (
                        <ul className="listItens" key={index}>
                            <li
                                onClick={() => handleAbrirModal(pedido)}
                                className="itensCompra"
                            >
                                <p>
                                    <span className="bold">Data:</span>{' '}
                                    {formatarData(pedido.dataPedido)}
                                </p>

                                <hr />

                                <div className="details">
                                    <p>
                                        <span className="bold">Pagamento</span>

                                        <br />

                                        {pedido.metodoPagamento}
                                    </p>

                                    <p>
                                        <span className="bold">Status</span>

                                        <br />

                                        <span
                                            className={
                                                pedido.status === 'Entregue' ||
                                                pedido.status ===
                                                    'Pedido entregue'
                                                    ? 'greenStatus'
                                                    : 'statusColor'
                                            }
                                        >
                                            {pedido.status}
                                        </span>
                                    </p>

                                    <p>
                                        <span className="bold">Valor</span>

                                        <br />

                                        {BRL.format(pedido.valorPedido)}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    ))}

                {!mostrarMais && pedidos.length > 3 && (
                    <a className="btnMost" onClick={handleToggleMostrar}>
                        Mostrar Mais
                    </a>
                )}

                {compraSelecionada && (
                    <OrderModal
                        pedido={compraSelecionada}
                        onClose={() => setCompraSelecionada(null)}
                    />
                )}
            </>
        </div>
    );
}
