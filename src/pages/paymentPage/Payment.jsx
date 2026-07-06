/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegCreditCard, FaBarcode } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs';
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
import { setFreteInfo } from '../../store/actions/freteActions';
import './payment.scss';
import Loading from '../../components/layout/loading/Loading';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/layout/checkoutSteps/CheckoutSteps';
import OrderSummary from '../../components/layout/orderSummary/OrderSummary';
import AddressSelector from './components/addressSelector/AddressSelector';
import PaymentMethodCard from './components/paymentMethodCard/PaymentMethodCard';
import UnifiedModals from '../../components/modals/UnifiedModals';
import { formatPreco } from '../../utils/formatters';

export default function PaymentPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsNavigatingToBuy } = useNavigation();
    const [cpf, setCpf] = useState('');
    const [isCpfRegistered, setIsCpfRegistered] = useState(false);
    const [paymentMethodName, setPaymentMethodName] = useState('');
    const [valorCompra, setValorCompra] = useState(0);
    const [, setCliente] = useState([]);
    const [clienteEndereco, setClienteEndereco] = useState([]);
    const [desconto, setDescontoLocal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modalState, setModalState] = useState({
        type: null,
        mode: null,
        item: null,
    });

    const selectedAddress = useSelector(
        (state) => state.payment.selectedAddress
    );
    const selectedPaymentMethod = useSelector(
        (state) => state.payment.selectedPaymentMethod
    );
    const paymentDesconto = useSelector((state) => state.payment.desconto);
    const Custofrete = useSelector((state) => state.frete.custo);
    const frete = useSelector((state) => state.frete);

    useEffect(() => {
        if (selectedPaymentMethod) {
            let discount = 0;
            let methodName = '';

            switch (selectedPaymentMethod) {
                case 'PIX':
                    discount = valorCompra * 0.15;
                    methodName = 'PIX';
                    break;
                case 'Crédito':
                    discount = 0;
                    methodName = 'Crédito';
                    break;
                case 'Boleto':
                    discount = valorCompra * 0.05;
                    methodName = 'Boleto';
                    break;
                default:
                    discount = 0;
                    methodName = '';
            }

            setDescontoLocal(discount);
            setPaymentMethodName(methodName);

            if (paymentDesconto !== discount) {
                setDescontoLocal(discount);
                dispatch(setDesconto(discount));
            }

            setPaymentMethodName(methodName);
        }
    }, [selectedPaymentMethod, selectedAddress, valorCompra, paymentDesconto]);

    useEffect(() => {
        if (!modalState.type && modalState.type === null) {
            const reloadEnderecos = async () => {
                try {
                    const clienteResponse = await getCliente();
                    setClienteEndereco(clienteResponse.enderecos);

                    if (
                        clienteResponse.enderecos.length > 0 &&
                        !selectedAddress?.cep
                    ) {
                        dispatch(
                            setSelectedAddress(clienteResponse.enderecos[0])
                        );
                        dispatch(
                            setFreteInfo({
                                ...frete,
                                cep: clienteResponse.enderecos[0].cep,
                            })
                        );
                    }
                } catch (error) {
                    console.error('Erro ao recarregar endereços:', error);
                }
            };

            reloadEnderecos();
        }
    }, [modalState.type]);

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

                if (
                    clienteResponse.enderecos.length > 0 &&
                    !selectedAddress?.cep
                ) {
                    dispatch(setSelectedAddress(clienteResponse.enderecos[0]));
                    dispatch(
                        setFreteInfo({
                            ...frete,
                            cep: clienteResponse.enderecos[0].cep,
                        })
                    );
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
                toast.success('CPF cadastrado!');
            }
        } catch (error) {
            toast.error('Erro ao cadastrar CPF.');
        }
    };

    const handlePaymentSelection = (e) => {
        const method = e.target.value;
        dispatch(setSelectedPaymentMethod(method));
        let discount = 0;
        let methodName = '';

        switch (method) {
            case 'PIX':
                discount = valorCompra * 0.15;
                methodName = 'PIX';
                break;
            case 'Crédito':
                discount = 0;
                methodName = 'Crédito';
                break;
            case 'Boleto':
                discount = valorCompra * 0.05;
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
            toast.warning('Por favor, cadastre seu CPF antes de continuar.');
            return;
        }

        if (!selectedPaymentMethod) {
            toast.warning('Por favor, selecione um método de pagamento.');
            return;
        }

        if (!selectedAddress?.cep) {
            toast.warning('Por favor, selecione um endereço de entrega.');
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

        dispatch(
            setFreteInfo({
                ...frete,
                cep: enderecoSelecionado.cep,
            })
        );
    };

    const openModal = (type, mode, item = null) => {
        setModalState({ type, mode, item });
    };

    const closeModal = () => {
        setModalState({ type: null, mode: null, item: null });
    };

    const handleSelectFromList = async (type, endereco) => {
        if (type === 'endereco' && endereco) {
            try {
                const clienteResponse = await getCliente();
                setClienteEndereco(clienteResponse.enderecos);

                dispatch(setSelectedAddress(endereco));

                dispatch(
                    setFreteInfo({
                        ...frete,
                        cep: endereco.cep,
                    })
                );

                toast.success('Endereço selecionado com sucesso!');
            } catch (error) {
                console.error('Erro ao atualizar endereços:', error);
                toast.error('Erro ao selecionar endereço');
            }
        }
        closeModal();
    };

    const getTotalComFrete = (discountPercent) => {
        const valorComDesconto = valorCompra - valorCompra * discountPercent;
        return valorComDesconto + Custofrete;
    };

    const totalPix = getTotalComFrete(0.15);
    const totalCredito = valorCompra + Custofrete;
    const totalBoleto = getTotalComFrete(0.05);

    return (
        <main>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <CheckoutSteps currentStep="pagamento" />

                    <section className="sectionPayment">
                        <div className="containerOptionsPay">
                            <p className="titlePay">
                                Selecione um método de pagamento:
                            </p>

                            <div className="optionsContainer">
                                <PaymentMethodCard
                                    id="cbPix"
                                    value="PIX"
                                    title="Pagar no PIX"
                                    icon={BsQrCodeScan}
                                    total={totalPix}
                                    productValue={
                                        valorCompra - valorCompra * 0.15
                                    }
                                    freight={Custofrete}
                                    badge="15% de desconto no produto"
                                    onChange={handlePaymentSelection}
                                    checked={selectedPaymentMethod === 'PIX'}
                                />

                                <PaymentMethodCard
                                    id="cbCredito"
                                    value="Crédito"
                                    title="Pagar no Crédito"
                                    icon={FaRegCreditCard}
                                    total={totalCredito}
                                    productValue={valorCompra}
                                    freight={Custofrete}
                                    installment={`12x de ${formatPreco(totalCredito / 12)} sem juros`}
                                    onChange={handlePaymentSelection}
                                    checked={
                                        selectedPaymentMethod === 'Crédito'
                                    }
                                />

                                <PaymentMethodCard
                                    id="cbBoleto"
                                    value="Boleto"
                                    title="Pagar no Boleto"
                                    icon={FaBarcode}
                                    total={totalBoleto}
                                    productValue={
                                        valorCompra - valorCompra * 0.05
                                    }
                                    freight={Custofrete}
                                    badge="5% de desconto no produto"
                                    onChange={handlePaymentSelection}
                                    checked={selectedPaymentMethod === 'Boleto'}
                                />
                            </div>
                        </div>

                        <div className="paymentSidebar">
                            <OrderSummary
                                valorCompra={valorCompra}
                                desconto={desconto}
                                frete={Custofrete}
                                paymentMethodName={paymentMethodName}
                                onConfirm={handleConfirmOrder}
                                onBack={() => window.history.back()}
                                backButtonText="Revisar Carrinho"
                            />

                            <AddressSelector
                                addresses={clienteEndereco}
                                selectedAddress={selectedAddress}
                                onChange={handleAddressChange}
                                onOpenModal={() => openModal('endereco', 'add')}
                            />

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
                        </div>
                    </section>

                    {modalState.type && (
                        <UnifiedModals
                            openModalType={modalState.type}
                            modalMode={modalState.mode}
                            onClose={closeModal}
                            externalSelectedItem={modalState.item}
                            onSelectFromList={handleSelectFromList}
                            externalInicialCep={frete?.cep}
                        />
                    )}
                </>
            )}
        </main>
    );
}
