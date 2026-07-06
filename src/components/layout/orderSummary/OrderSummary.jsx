import PropTypes from 'prop-types';
import { PiFileMagnifyingGlass } from 'react-icons/pi';
import './orderSummary.scss';
import { formatPreco } from '../../../utils/formatters';
import { IoArrowBack } from 'react-icons/io5';

export default function OrderSummary({
    valorCompra,
    desconto,
    frete,
    paymentMethodName,
    onConfirm,
    onBack,
    customButtonText = 'Finalizar Pedido',
    backButtonText = 'Voltar',
    showBackButton = true,
}) {
    const total = valorCompra - desconto + frete;

    return (
        <div className="orderSummary">
            <div className="titleContainers">
                <PiFileMagnifyingGlass className="iconOrder" />
                <h3>Resumo</h3>
            </div>
            <div className="dataResume">
                <div className="lineOrder">
                    <p>Valor do Produto:</p>
                    <p>{formatPreco(valorCompra)}</p>
                </div>

                <div className="lineOrder">
                    <p>Desconto:</p>
                    {desconto > 0 ? (
                        <p className="discount">-{formatPreco(desconto)}</p>
                    ) : (
                        <p className="discount">{formatPreco(0)}</p>
                    )}
                </div>

                <div className="lineOrder">
                    <p>Frete:</p>
                    <p>{frete > 0 ? formatPreco(frete) : 'A calcular'}</p>
                </div>

                <div className="lineOrder">
                    <p>Forma de Pagamento:</p>
                    {paymentMethodName == '' ? (
                        <p>————</p>
                    ) : (
                        <p>{paymentMethodName}</p>
                    )}
                </div>

                <div className="total">
                    <h2>{formatPreco(total)}</h2>
                </div>

                <div className="buttonsContainer">
                    <button className="confirmOrder" onClick={onConfirm}>
                        {customButtonText}
                    </button>

                    {showBackButton && (
                        <button className="backButton" onClick={onBack}>
                            <IoArrowBack className="backIcon" />
                            {backButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

OrderSummary.propTypes = {
    valorCompra: PropTypes.number.isRequired,
    desconto: PropTypes.number,
    frete: PropTypes.number.isRequired,
    paymentMethodName: PropTypes.string,
    onConfirm: PropTypes.func,
    onBack: PropTypes.func,
    customButtonText: PropTypes.string,
    backButtonText: PropTypes.string,
    showBackButton: PropTypes.bool,
};
