import PropTypes from 'prop-types';

import { FaRegCreditCard, FaBarcode } from 'react-icons/fa';

import { formatPreco } from '../../../../utils/formatters';

import './cartSummary.scss';

export default function CartSummary({
    loading,
    subtotal,
    total,
    frete,
    onCheckout,
}) {
    const desconto = subtotal * 0.15;
    const totalPix = total - desconto;

    return (
        <div className={`resumeBuy ${loading ? 'loading' : ''}`}>
            <h3>Resumo</h3>

            <div className="values">
                <p>SubTotal:</p>

                <p>{formatPreco(subtotal)}</p>
            </div>

            <div className="values">
                <p>Entrega:</p>

                <p>{formatPreco(frete)}</p>
            </div>

            <div className="values">
                <p>Total:</p>

                <strong>{formatPreco(total)}</strong>
            </div>

            <div className="paymentOptions">
                <div className="options">
                    <FaRegCreditCard className="icon" />

                    <p>
                        <strong>{formatPreco(total)}</strong>
                        <br />
                        em 12x de <span>{formatPreco(total / 12)}</span> s/
                        juros
                    </p>
                </div>

                <div className="options">
                    <FaBarcode className="icon" />

                    <p>
                        <strong>{formatPreco(totalPix)}</strong>
                        <br />
                        com desconto à vista no boleto ou pix
                    </p>
                </div>
            </div>

            <button type="button" className="endOrder" onClick={onCheckout}>
                Ir para o Pagamento
            </button>
        </div>
    );
}

CartSummary.propTypes = {
    loading: PropTypes.bool.isRequired,
    subtotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    frete: PropTypes.number.isRequired,
    onCheckout: PropTypes.func.isRequired,
};
