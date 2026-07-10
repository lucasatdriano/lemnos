import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TbTruckDelivery } from 'react-icons/tb';
import { verificarCep } from '../../../../services/EnderecoService';
import { setFreteInfo } from '../../../../store/slices/freteSlice';
import './deliveryCalculator.scss';
import { formatCurrency } from '../../../../utils/formatters';

export default function DeliveryCalculator() {
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart.items);

    const frete = useSelector((state) => state.frete);

    const cepInputRef = useRef(null);

    const [cep, setCep] = useState(frete?.cep || '');
    const [showOptions, setShowOptions] = useState(!!frete?.cep);

    useEffect(() => {
        if (frete?.cep) {
            setCep(frete.cep);
            setShowOptions(true);
        }
    }, [frete?.cep]);

    function addDaysToDate(days) {
        const result = new Date();

        result.setDate(result.getDate() + days);

        const day = String(result.getDate()).padStart(2, '0');
        const month = String(result.getMonth() + 1).padStart(2, '0');
        const year = result.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function handleCepChange(event) {
        let formattedCep = event.target.value.replace(/\D/g, '');

        if (formattedCep.length > 5) {
            formattedCep = formattedCep.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        setCep(formattedCep);

        if (formattedCep.length !== 9) {
            setShowOptions(false);
        }
    }

    async function handleCalculateDelivery() {
        if (!cart?.length) {
            toast.warning('Por favor, adicione um produto no seu carrinho.');

            return;
        }

        if (cep.length === 0) {
            toast.warning('Por favor, adicione o seu CEP.');

            cepInputRef.current.focus();

            return;
        }

        if (cep.length !== 9) {
            toast.warning('Por favor, adicione o CEP completo.');

            cepInputRef.current.focus();

            return;
        }

        try {
            const cepValido = await verificarCep(cep);

            if (!cepValido) {
                toast.error('CEP não existente.');

                return;
            }

            setShowOptions(true);

            dispatch(
                setFreteInfo({
                    ...frete,
                    cep,
                })
            );
        } catch (error) {
            toast.error('Erro ao verificar o CEP.');
        }
    }

    function handleSelectOption(option, price, term) {
        dispatch(
            setFreteInfo({
                metodo: option,
                custo: price,
                dataEstimadaEnvio: addDaysToDate(term),
                prazoEntrega: term,
                cep,
            })
        );
    }

    return (
        <div className="delivery">
            <h4>Calcular Entrega</h4>

            <div className="containerCep">
                <div className="inputCepFormField">
                    <input
                        type="text"
                        value={cep}
                        maxLength={9}
                        ref={cepInputRef}
                        placeholder="Digite seu CEP"
                        onChange={handleCepChange}
                    />

                    <button
                        type="button"
                        className="calcDelivery"
                        onClick={handleCalculateDelivery}
                    >
                        Calcular
                        <TbTruckDelivery className="icon" />
                    </button>
                </div>

                <a
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="SearchCep"
                >
                    Não sei meu CEP
                </a>
            </div>

            {showOptions && (
                <>
                    <div className="deliveryOption">
                        <div className="deliveryOptionInfo">
                            <input
                                type="radio"
                                name="delivery"
                                checked={frete?.metodo === 'Sedex'}
                                onChange={() =>
                                    handleSelectOption('Sedex', 26.99, 7)
                                }
                                className="inputRadioCep"
                            />

                            <label>
                                <strong>Sedex</strong>

                                <p>Prazo de entrega: em até 7 dias</p>
                            </label>
                        </div>

                        <strong>{formatCurrency(26.99)}</strong>
                    </div>

                    <div className="deliveryOption">
                        <div className="deliveryOptionInfo">
                            <input
                                type="radio"
                                name="delivery"
                                checked={frete?.metodo === 'Jadlog'}
                                onChange={() =>
                                    handleSelectOption('Jadlog', 32.99, 15)
                                }
                                className="inputRadioCep"
                            />

                            <label>
                                <strong>Jadlog</strong>

                                <p>Prazo de entrega: em até 15 dias</p>
                            </label>
                        </div>

                        <strong>{formatCurrency(32.99)}</strong>
                    </div>

                    <div className="deliveryOption">
                        <div className="deliveryOptionInfo">
                            <input
                                type="radio"
                                name="delivery"
                                checked={frete?.metodo === 'Express'}
                                onChange={() =>
                                    handleSelectOption('Express', 45.99, 12)
                                }
                                className="inputRadioCep"
                            />

                            <label>
                                <strong>Express</strong>

                                <p>Prazo de entrega: em até 12 dias</p>
                            </label>
                        </div>

                        <strong>{formatCurrency(45.99)}</strong>
                    </div>
                </>
            )}
        </div>
    );
}
