/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TbPackageExport } from 'react-icons/tb';
import { MdInfoOutline } from 'react-icons/md';
import { RiShoppingCartLine } from 'react-icons/ri';
import { BsTruck } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCreditCard, FaRoute, FaTruckFast } from 'react-icons/fa6';
import { LuPackageCheck } from 'react-icons/lu';
import { PiFileMagnifyingGlass } from 'react-icons/pi';
import { IoCart } from 'react-icons/io5';
import ModalCompleted from './components/ModalCompleted';
import './buy.scss';
import AuthService from '../../services/AuthService';
import {
    atualizarStatus,
    novoPedido,
    listarPedido,
    pedidoPorId,
} from '../../services/UsuarioProdutoService';
import { getCliente } from '../../services/ClienteService';
import { toast } from 'react-toastify';

const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const formatCPF = (cpf) => {
    if (!cpf) return '';
    return cpf
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCEP = (cep) => {
    if (!cep) return '';
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
};

export default function BuyPage() {
    const dispatch = useDispatch();
    const carrinho = useSelector((state) => state.cart.items);
    const valorCompra = useSelector((state) => state.cart.totalAmount);

    const [isModalCompleted, setIsModalCompleted] = useState(false);
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
            setIsModalCompleted(true);
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
            toast.success('Compra Realizada', {
                position: "bottom-right"
            });
        } catch (error) {
            console.error('Erro ao realizar compra', error);
        }
    };

    const statusStyles = (status) => {
        const currentStatus = pedidoStatus.toLowerCase();

        if (AuthService.getTheme() === 'light') {
            switch (status.toLowerCase()) {
                case 'em processamento':
                case 'enviado para a transportadora':
                case 'recebido pela transportadora':
                case 'mercadoria em trânsito':
                case 'mercadoria em rota de entrega':
                case 'Entregue':
                    return {
                        color:
                            currentStatus === status.toLowerCase()
                                ? '#36cec4'
                                : '#686767',
                    };
                default:
                    return { color: '#686767' };
            }
        } else {
            switch (status.toLowerCase()) {
                case 'em processamento':
                case 'enviado para a transportadora':
                case 'recebido pela transportadora':
                case 'mercadoria em trânsito':
                case 'mercadoria em rota de entrega':
                case 'Entregue':
                    return {
                        color:
                            currentStatus === status.toLowerCase()
                                ? '#36cec4'
                                : '#c2c9c7',
                    };
                default:
                    return { color: '#c2c9c7' };
            }
        }
    };

    return (
        <>
            <main>
                <div className="statusOrder">
                    <div className="status">
                        <IoCart className="iconStatus" />
                        <p>Carrinho</p>
                    </div>
                    <span></span>
                    <div className="status">
                        <FaCreditCard className="iconStatus" />
                        <p>Pagamento</p>
                    </div>
                    <span></span>
                    <div className="status">
                        <FaCheckCircle className="iconStatus" />
                        <p>Confirmação</p>
                    </div>
                </div>
                <div className="loadingOrder">
                    <div className="loadingBackground">
                        <div>
                            <AiOutlineLoading3Quarters
                                style={statusStyles('Em processamento')}
                                className="iconLoadingOrder"
                            />
                            <h3 style={statusStyles('Em processamento')}>
                                Em processamento
                            </h3>
                        </div>
                        <div>
                            <TbPackageExport
                                style={statusStyles(
                                    'Enviado para a transportadora'
                                )}
                                className="iconLoadingOrder"
                            />
                            <h3
                                style={statusStyles(
                                    'Enviado para a transportadora'
                                )}
                            >
                                Enviado para a transportadora
                            </h3>
                        </div>
                        <div>
                            <FaCheckCircle
                                style={statusStyles(
                                    'Recebido pela transportadora'
                                )}
                                className="iconLoadingOrder"
                            />
                            <h3
                                style={statusStyles(
                                    'Recebido pela transportadora'
                                )}
                            >
                                Recebido pela transportadora
                            </h3>
                        </div>
                        <div>
                            <FaRoute
                                style={statusStyles('Mercadoria em trânsito')}
                                className="iconLoadingOrder"
                            />
                            <h3 style={statusStyles('Mercadoria em trânsito')}>
                                Mercadoria em trânsito
                            </h3>
                        </div>
                        <div>
                            <FaTruckFast
                                style={statusStyles(
                                    'Mercadoria em rota de entrega'
                                )}
                                className="iconLoadingOrder"
                            />
                            <h3
                                style={statusStyles(
                                    'Mercadoria em rota de entrega'
                                )}
                            >
                                Mercadoria em rota de entrega
                            </h3>
                        </div>
                        <div>
                            <LuPackageCheck
                                style={statusStyles('Entregue')}
                                className="iconLoadingOrder"
                            />
                            <h3 style={statusStyles('Entregue')}>
                                Pedido entregue
                            </h3>
                        </div>
                    </div>
                    <div className="loadingProgress"></div>
                </div>
                <section className="sectionOrder">
                    <div className="divOrder">
                        <div className="personalData">
                            <div className="titleContainers">
                                <MdInfoOutline className="iconOrder" />
                                <h3>Dados do Cliente</h3>
                            </div>
                            <hr className="hrTitle" />
                            <div className="dataContainer">
                                <div>
                                    <h4 className="titleData">
                                        Dados Pessoais
                                    </h4>
                                    <div className="dataPerson">
                                        <p>Nome: {cliente.nome || ''}</p>
                                        <p>
                                            CPF: {formatCPF(cliente.cpf) || ''}
                                        </p>
                                        <p>Email: {cliente.email || ''}</p>
                                    </div>
                                </div>
                                <hr className="hrData" />
                                <div className="enderecoContainer">
                                    <h4 className="titleData">Endereço</h4>
                                    <div className="dataEnd">
                                        <p>
                                            CEP:{' '}
                                            {formatCEP(selectedAddress.cep) ||
                                                ''}
                                        </p>
                                        <p>
                                            Logradouro:{' '}
                                            {selectedAddress.logradouro || ''}
                                        </p>
                                        <p>
                                            Estado: {selectedAddress.uf || ''}
                                        </p>
                                        <p>
                                            Bairro:{' '}
                                            {selectedAddress.bairro || ''}
                                        </p>
                                        <p>
                                            Cidade:{' '}
                                            {selectedAddress.cidade || ''}
                                        </p>
                                        <p>
                                            Número:{' '}
                                            {selectedAddress.numeroLogradouro ||
                                                ''}
                                        </p>
                                        <p>
                                            Complemento:{' '}
                                            {selectedAddress.complemento || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shippingCart">
                            <div className="cart">
                                <div className="titleContainers">
                                    <RiShoppingCartLine className="iconOrder" />
                                    <h3>Carrinho</h3>
                                </div>
                                <hr className="hrTitle" />
                                <table className="dataProduct">
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Produto</th>
                                            <th>Quantidade</th>
                                            <th>Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carrinho.map((produto, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img
                                                        src={
                                                            produto.imagemPrincipal
                                                        }
                                                        alt={produto.nome}
                                                    />
                                                </td>
                                                <td>
                                                    <p>{produto.nome}</p>
                                                </td>
                                                <td>{produto.qntdProduto}</td>
                                                <td>
                                                    {BRL.format(
                                                        produto.valorComDesconto *
                                                            produto.qntdProduto
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="delivery">
                                <div className="titleContainers">
                                    <BsTruck className="iconOrder" />
                                    <h3>Frete</h3>
                                </div>
                                <hr className="hrTitle" />
                                <div className="dataDelivery">
                                    <div>
                                        <p>
                                            {frete.metodo}:{' '}
                                            <span>
                                                Chegará até{' '}
                                                {frete.dataEstimadaEnvio}
                                            </span>
                                        </p>
                                        <p className="term">
                                            Prazo de entrega: Em até{' '}
                                            {frete.prazoEntrega} dias.
                                        </p>
                                    </div>
                                    <p>{BRL.format(frete.custo)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="orderSummary">
                        <div className="titleContainers">
                            <PiFileMagnifyingGlass className="iconOrder" />
                            <h3>Resumo</h3>
                        </div>
                        <hr className="hrTitle" />
                        <div className="dataResume">
                            <div className="lineOrder">
                                <p>Valor do Produto:</p>
                                <p>{BRL.format(valorCompra)}</p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Desconto:</p>
                                <p className="discount">
                                    -{BRL.format(desconto)}
                                </p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Frete:</p>
                                <p>{BRL.format(frete.custo)}</p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Forma de Pagamento:</p>
                                <p>{selectedPaymentMethod}</p>
                            </div>
                            <hr className="hrResume" />
                            <h2>
                                {BRL.format(
                                    valorCompra - desconto + frete.custo
                                )}
                            </h2>
                            <button
                                type="button"
                                onClick={handleConfirmOrder}
                                className="confirmOrder"
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            {isModalCompleted && (
                <ModalCompleted onClose={() => setIsModalCompleted(false)} />
            )}
        </>
    );
}
