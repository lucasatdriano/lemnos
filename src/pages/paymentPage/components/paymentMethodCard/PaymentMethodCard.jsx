import PropTypes from 'prop-types';
import './paymentMethodCard.scss';
import { formatCurrency } from '../../../../utils/formatters';

export default function PaymentMethodCard({
    id,
    value,
    checked,
    title,
    icon: Icon,
    total,
    productValue,
    freight,
    badge,
    installment,
    onChange,
}) {
    return (
        <div className="optionPay">
            <input
                type="radio"
                name="cbPay"
                id={id}
                value={value}
                onChange={onChange}
                checked={checked}
            />

            <label htmlFor={id} className="labelPay">
                <Icon className="iconPayment" />

                <div className="paymentInfo">
                    <h3>{title}</h3>

                    <div className="paymentValues">
                        <div className="mainValue">
                            <span
                                className={
                                    badge ? 'discountValue' : 'normalValue'
                                }
                            >
                                {formatCurrency(productValue)}
                            </span>

                            <span className="freteInfo">
                                + {formatCurrency(freight)} de frete
                            </span>
                        </div>

                        <div className="subValue">
                            <div className="totalValue">
                                Total: {formatCurrency(total)}
                            </div>

                            {badge && (
                                <span className="discountBadge">{badge}</span>
                            )}

                            {installment && (
                                <span className="installmentInfo">
                                    {installment}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </label>
        </div>
    );
}

PaymentMethodCard.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    total: PropTypes.number.isRequired,
    productValue: PropTypes.number.isRequired,
    freight: PropTypes.number.isRequired,
    badge: PropTypes.string,
    installment: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
