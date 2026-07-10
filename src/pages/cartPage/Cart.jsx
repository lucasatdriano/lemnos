import { useEffect, useState, useRef, useCallback } from 'react';
import { clearCarrinho, setCarrinho } from '../../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { MdDelete } from 'react-icons/md';

import {
    listarCarrinho,
    apagarCarrinho,
} from '../../services/UsuarioProdutoService';

import { getProdutoById } from '../../services/ProdutoService';

import { useNavigation } from '../../hooks/useNavigation';

import Loading from '../../components/layout/loading/Loading';
import OfferList from '../../components/layout/lists/OfferList';

import cartEventEmitter from '../../services/configurations/events';

import DeliveryCalculator from './components/deliveryCalculator/DeliveryCalculator';
import CartSummary from './components/cartSummary/CartSummary';
import CartCard from './components/cartCard/CartCard';

import './cart.scss';
import { resetFrete } from '../../store/slices/freteSlice';
import { useAuth } from '../../hooks/useAuth';

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setIsNavigatingToPayment } = useNavigation();
    const { isAuthenticated } = useAuth();

    const cartRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const cart = useSelector((state) => state.cart.items);
    const frete = useSelector((state) => state.frete);

    const fetchCarrinho = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                return;
            }

            const response = await listarCarrinho();

            if (!response || response.produtos.length === 0) {
                dispatch(clearCarrinho());
                dispatch(resetFrete());
                return;
            }

            const carrinhoDetalhado = await Promise.all(
                response.produtos.map(async (produto) => {
                    const detalhesProduto = await getProdutoById(produto.id);

                    return {
                        ...produto,
                        ...detalhesProduto,
                    };
                })
            );

            carrinhoDetalhado.sort((a, b) => a.nome.localeCompare(b.nome));

            dispatch(
                setCarrinho({
                    items: carrinhoDetalhado,
                    totalAmount: response.valorTotal,
                })
            );
        } catch (error) {
            console.error('Erro ao obter itens do carrinho:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        setIsLoading(true);

        fetchCarrinho();

        cartEventEmitter.on('produtoAdicionado', fetchCarrinho);

        return () => {
            cartEventEmitter.off('produtoAdicionado', fetchCarrinho);
        };
    }, [fetchCarrinho]);

    const calcularSubTotal = () => {
        if (!cart?.length) return 0;

        return cart.reduce(
            (total, produto) =>
                total + produto.qntdProduto * produto.valorComDesconto,
            0
        );
    };

    const calcularTotal = () => {
        return calcularSubTotal() + (frete?.custo || 0);
    };

    async function handleCleanCart() {
        try {
            await apagarCarrinho();

            dispatch(clearCarrinho());
            dispatch(resetFrete());
        } catch (error) {
            console.error('Erro ao apagar carrinho:', error);
        }
    }

    async function finalizarPedido() {
        try {
            if (!cart?.length) {
                toast.warning('Por favor, adicione algum item no carrinho.');

                cartRef.current.scrollIntoView({
                    behavior: 'smooth',
                });

                return;
            }

            if (!frete?.metodo) {
                toast.warning('Por favor, selecione uma opção de entrega.');

                return;
            }

            if (!isAuthenticated) {
                toast.warning(
                    'Por favor, faça login para continuar com o pedido.'
                );
                navigate('/auth');

                return;
            }

            setIsNavigatingToPayment(true);

            navigate('/payment');
        } catch (error) {
            console.error('Erro ao continuar pedido:', error);
        }
    }

    return (
        <main>
            <div className="title" ref={cartRef}>
                <hr className="hrTitle" />
                <h2>Meu Carrinho</h2>
                <hr className="hrTitle" />
            </div>

            <section className="containerMain">
                <div className="containerCart">
                    {isLoading ? (
                        <Loading />
                    ) : cart?.length > 0 ? (
                        <ul className="listCart">
                            {cart.map((produto) => (
                                <CartCard key={produto.id} produto={produto} />
                            ))}
                        </ul>
                    ) : (
                        <div className="emptyCartMessage">
                            <h2 className="textEmpty">
                                O seu carrinho está vazio.
                            </h2>

                            <button
                                className="btnBackBuy"
                                onClick={() => navigate('/productFilter')}
                            >
                                Voltar para às compras
                            </button>
                        </div>
                    )}

                    {!!cart?.length && (
                        <button
                            type="button"
                            className="cleanCart"
                            onClick={handleCleanCart}
                        >
                            Limpar Carrinho
                            <MdDelete className="icon" />
                        </button>
                    )}
                </div>

                <div className="resume">
                    <CartSummary
                        loading={isLoading}
                        subtotal={calcularSubTotal()}
                        total={calcularTotal()}
                        frete={frete?.custo || 0}
                        onCheckout={finalizarPedido}
                    />

                    <DeliveryCalculator />
                </div>
            </section>

            <section className="offers">
                <h2>Continue Comprando</h2>

                <OfferList onlyOnSale />
            </section>
        </main>
    );
}
