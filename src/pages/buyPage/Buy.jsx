/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/AuthService';
import {
    atualizarStatus,
    novoPedido,
    listarPedido,
    pedidoPorId,
} from '../../services/UsuarioProdutoService';
import { getCliente } from '../../services/ClienteService';
import { toast } from 'react-toastify';
import UnifiedModals from '../../components/modals/UnifiedModals';
import CheckoutSteps from '../../components/layout/checkoutSteps/CheckoutSteps';
import OrderSummary from '../../components/layout/orderSummary/OrderSummary';
import ShippingInfo from './components/shippingInfo/ShippingInfo';
import OrderItems from './components/orderItems/OrderItems';
import CustomerData from './components/customerData/CustomerData';
import OrderTracking from './components/orderTracking/OrderTracking';
import './buy.scss';

export default function BuyPage() {
    const dispatch = useDispatch();
    const carrinho = useSelector((state) => state.cart.items);
    const valorCompra = useSelector((state) => state.cart.totalAmount);

    const [modalComplete, setModalComplete] = useState(false);
    const [cliente, setCliente] = useState({});
    const [pedidoStatus, setPedidoStatus] = useState('');
    const [pedidoId, setPedidoId] = useState(null);
    const [statusUpdates, setStatusUpdates] = useState(0);

    const frete = useSelector((state) => state.frete);
    const selectedPaymentMethod = useSelector(
        (state) => state.payment.selectedPaymentMethod
    );
    const selectedAddress = useSelector(
        (state) => state.payment.selectedAddress
    );
    const desconto = useSelector((state) => state.payment.desconto);

    useEffect(() => {
        async function fetchCliente() {
            try {
                if (AuthService.isLoggedIn()) {
                    const clienteResponse = await getCliente();
                    setCliente(clienteResponse || {});
                }
            } catch (error) {
                console.error('Erro ao obter dados do cliente:', error);
            }
        }
        fetchCliente();
    }, [dispatch]);

    const fetchPedidoStatus = async (pedidoId) => {
        try {
            await atualizarStatus(pedidoId);

            const pedidoAtualizado = await pedidoPorId(pedidoId);

            if (pedidoAtualizado) {
                setPedidoStatus(pedidoAtualizado.status);
                setStatusUpdates((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error);
        }
    };

    useEffect(() => {
        if (pedidoId) {
            const interval = setInterval(() => {
                fetchPedidoStatus(pedidoId);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [pedidoId]);

    useEffect(() => {
        if (statusUpdates >= 5) {
            const timer = setTimeout(() => {
                setModalComplete(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [statusUpdates]);

    const handleConfirmOrder = async () => {
        const pedidoData = {
            metodoPagamento: selectedPaymentMethod,
            fretePedido: frete.custo,
            valorPedido: valorCompra - desconto + frete.custo,
        };

        try {
            await novoPedido(pedidoData);

            const pedidos = await listarPedido();
            const newPedido = pedidos[pedidos.length - 1];
            setPedidoId(newPedido.id);
            setPedidoStatus(newPedido.status);
            toast.success('Compra Realizada');
        } catch (error) {
            console.error('Erro ao realizar compra', error);
        }
    };

    return (
        <>
            <main>
                <CheckoutSteps currentStep="confirmacao" />

                <section className="orderSection">
                    <OrderTracking pedidoStatus={pedidoStatus} />

                    <div className="shippingCartWrapper">
                        <div className="orderContent">
                            <CustomerData
                                cliente={cliente}
                                selectedAddress={selectedAddress}
                            />

                            <div className="shippingCart">
                                <OrderItems carrinho={carrinho} />
                            </div>

                            <ShippingInfo frete={frete} />
                        </div>

                        <div className="paymentDetails">
                            <OrderSummary
                                valorCompra={valorCompra}
                                desconto={desconto}
                                frete={frete.custo}
                                paymentMethodName={selectedPaymentMethod}
                                onConfirm={handleConfirmOrder}
                                onBack={() => window.history.back()}
                                customButtonText="Confirmar Pedido"
                                backButtonText="Revisar Pagamento"
                            />
                        </div>
                    </div>
                </section>
            </main>

            {modalComplete && (
                <UnifiedModals
                    openModalType="completed"
                    modalMode="complete"
                    onClose={() => setModalComplete(false)}
                />
            )}
        </>
    );
}
