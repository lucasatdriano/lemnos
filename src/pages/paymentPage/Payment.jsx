/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCart } from 'react-icons/io5';
import { FaCreditCard, FaRegCreditCard, FaBarcode } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { BsQrCodeScan } from 'react-icons/bs';
import { PiFileMagnifyingGlass } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { listarCarrinho } from '../../services/UsuarioProdutoService';
import { getCliente, updateCliente } from '../../services/ClienteService';
import AuthService from '../../services/AuthService';
import { useNavigation } from '../../NavigationProvider';
import {
    setSelectedAddress,
    setDesconto,
    setSelectedPaymentMethod,
} from '../../store/actions/paymentActions';
import './payment.scss';
import Loading from '../../components/loading/Loading';
import { useNavigate } from 'react-router-dom';

const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function PaymentPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsNavigatingToBuy } = useNavigation();
    const [cpf, setCpf] = useState('');
    const [isCpfRegistered, setIsCpfRegistered] = useState(false);
    const [paymentMethodName, setPaymentMethodName] = useState('');
    const [valorCompra, setValorCompra] = useState(0);
    const [cliente, setCliente] = useState([]);
    const [clienteEndereco, setClienteEndereco] = useState([]);
    const [desconto, setDescontoLocal] = useState(0);
    const [loading, setLoading] = useState(false);

    const selectedAddress = useSelector(
        (state) => state.payment.selectedAddress
    );
    const selectedPaymentMethod = useSelector(
        (state) => state.payment.selectedPaymentMethod
    );
    const Custofrete = useSelector((state) => state.frete.custo);

    async function fetchPagamento() {
        setLoading(true);
        try {
            if (AuthService.isLoggedIn()) {
                const response = await listarCarrinho();
                const clienteResponse = await getCliente();

                setCliente(clienteResponse);
                setValorCompra(response.valorTotal);

                if (clienteResponse.cpf && clienteResponse.cpf !== '') {
                    setIsCpfRegistered(true);
                }

                setClienteEndereco(clienteResponse.enderecos);
                if (clienteResponse.enderecos.length > 0) {
                    dispatch(setSelectedAddress(clienteResponse.enderecos[0]));
                }
            }
        } catch (error) {
            console.error('Erro ao obter itens do carrinho:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPagamento();
    }, [AuthService.isLoggedIn()]);

    const handleCpfChange = (event) => {
        let formattedCpf = event.target.value.replace(/\D/g, '');
        if (formattedCpf.length > 3) {
            formattedCpf = formattedCpf.replace(/^(\d{3})(\d)/, '$1.$2');
        }
        if (formattedCpf.length > 6) {
            formattedCpf = formattedCpf.replace(
                /^(\d{3})\.(\d{3})(\d)/,
                '$1.$2.$3'
            );
        }
        if (formattedCpf.length > 9) {
            formattedCpf = formattedCpf.replace(
                /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
                '$1.$2.$3-$4'
            );
        }
        setCpf(formattedCpf);
    };

    const handleSaveCpf = async () => {
        const usuario = {
            cpf: String(cpf).replace(/\D/g, ''),
        };

        try {
            const success = await updateCliente(usuario);
            if (success) {
                setIsCpfRegistered(true);
                toast.success('CPF cadastrado!', {
                    position: "bottom-right"
                });
            }
        } catch (error) {
            toast.error('Erro ao cadastrar CPF.', {
                position: "bottom-right"
            });
        }
    };

    const handlePaymentSelection = (e) => {
        const method = e.target.value;
        dispatch(setSelectedPaymentMethod(method));
        let discount = 0;
        let methodName = '';

        switch (method) {
            case 'PIX':
                discount = (valorCompra / 100) * 15;
                methodName = 'PIX';
                break;
            case 'Crédito':
                discount = 0;
                methodName = 'Crédito';
                break;
            case 'Boleto':
                discount = (valorCompra / 100) * 5;
                methodName = 'Boleto';
                break;
            default:
                discount = 0;
                methodName = '';
        }

        setDescontoLocal(discount);
        dispatch(setDesconto(discount));
        setPaymentMethodName(methodName);
    };

    const handleConfirmOrder = async () => {
        if (!isCpfRegistered) {
            toast.warning('Por favor, cadastre seu CPF antes de continuar.', {
                position: "bottom-right"
            });
            return;
        }

        if (!selectedPaymentMethod) {
            toast.warning('Por favor, selecione um método de pagamento.', {
                position: "bottom-right"
            });
            return;
        }

        if (!selectedAddress.cep) {
            toast.warning('Por favor, selecione um endereço de entrega.', {
                position: "bottom-right"
            });
            return;
        }

        setIsNavigatingToBuy(true);
        navigate('/buy');
    };

    const handleAddressChange = (e) => {
        const enderecoSelecionado = clienteEndereco.find(
            (endereco) => endereco.cep === e.target.value
        );
        dispatch(setSelectedAddress(enderecoSelecionado));
    };

    return (
        <main>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="statusPay">
                        <div className="status">
                            <IoCart className="iconStatus" />
                            <p>Carrinho</p>
                        </div>
                        <span></span>
                        <div className="status">
                            <FaCreditCard className="iconStatus" />
                            <p>Pagamento</p>
                        </div>
                        <span className="spanWaiting"></span>
                        <div className="waitingStatus">
                            <FaCheckCircle className="iconStatus" />
                            <p>Confirmação</p>
                        </div>
                    </div>
                    <section className="sectionPayment">
                        <div className="containerOptionsPay">
                            <p className="titlePay">
                                Selecione um método de pagamento:
                            </p>
                            <div key="pix" className="optionPay">
                                <input
                                    type="radio"
                                    name="cbPay"
                                    id="cbPix"
                                    value="PIX"
                                    onChange={handlePaymentSelection}
                                />
                                <label htmlFor="cbPix" className="labelPay">
                                    <BsQrCodeScan className="iconPayment" />
                                    <h3>Pagar no PIX</h3>
                                    <p>
                                        <span>
                                            {BRL.format(
                                                valorCompra -
                                                    (valorCompra / 100) * 15
                                            )}
                                        </span>
                                        <br />
                                        Em até 15% de desconto
                                    </p>
                                </label>
                            </div>
                            <div key="credito" className="optionPay">
                                <input
                                    type="radio"
                                    name="cbPay"
                                    id="cbCredito"
                                    value="Crédito"
                                    onChange={handlePaymentSelection}
                                />
                                <label htmlFor="cbCredito" className="labelPay">
                                    <FaRegCreditCard className="iconPayment" />
                                    <h3>Pagar no Crédito</h3>
                                    <p>
                                        <span>{BRL.format(valorCompra)}</span>{' '}
                                        <br />
                                        Em até 12x sem juros
                                    </p>
                                </label>
                            </div>
                            <div key="boleto" className="optionPay">
                                <input
                                    type="radio"
                                    name="cbPay"
                                    id="cbBoleto"
                                    value="Boleto"
                                    onChange={handlePaymentSelection}
                                />
                                <label htmlFor="cbBoleto" className="labelPay">
                                    <FaBarcode className="iconPayment" />
                                    <h3>Pagar no Boleto</h3>
                                    <p>
                                        <span>
                                            {BRL.format(
                                                valorCompra -
                                                    (valorCompra / 100) * 5
                                            )}
                                        </span>
                                        <br />
                                        Em até 5% de desconto
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div>
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
                                        <p>{BRL.format(Custofrete)}</p>
                                    </div>
                                    <hr className="hrResume" />
                                    <div className="lineOrder">
                                        <p>Forma de Pagamento:</p>
                                        <p>{paymentMethodName}</p>
                                    </div>
                                    <hr className="hrResume" />
                                    <h2>
                                        {BRL.format(
                                            valorCompra - desconto + Custofrete
                                        )}
                                    </h2>
                                    <button
                                        className="confirmOrder"
                                        onClick={handleConfirmOrder}
                                    >
                                        Finalizar Pedido
                                    </button>
                                </div>
                            </div>

                            {!isCpfRegistered && (
                                <div className="registrationCPF">
                                    <h4>Cadastrar CPF</h4>
                                    <hr className="hrCPF" />
                                    <div className="inputCpf">
                                        <input
                                            type="text"
                                            placeholder="Digite seu CPF"
                                            value={cpf}
                                            onChange={handleCpfChange}
                                            maxLength={14}
                                            inputMode="numeric"
                                            pattern="\d{3}.?\d{3}.?\d{3}-?\d{2}"
                                        />
                                        <button
                                            type="button"
                                            className="saveCpf"
                                            onClick={handleSaveCpf}
                                        >
                                            Salvar CPF
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="containerAddress">
                                {clienteEndereco.length === 0 ? (
                                    <p className="textAddress">
                                        Nenhum endereço cadastrado
                                    </p>
                                ) : (
                                    <>
                                        <p className="textAddress">
                                            Selecione o Endereço de Entrega
                                        </p>
                                        <select
                                            value={selectedAddress.cep}
                                            onChange={handleAddressChange}
                                        >
                                            {clienteEndereco.map(
                                                (endereco, index) => (
                                                    <option
                                                        key={index}
                                                        value={endereco.cep}
                                                    >
                                                        {`${endereco.cep} - ${endereco.logradouro}, ${endereco.numeroLogradouro} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
