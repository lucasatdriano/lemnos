import PropTypes from 'prop-types';
import { BsTruck } from 'react-icons/bs';
import './shippingInfo.scss';
import { formatCurrency } from '../../../../utils/formatters';

export default function ShippingInfo({ frete }) {
    return (
        <div className="shippingInfo">
            <div className="titleContainers">
                <BsTruck className="iconOrder" />
                <h3>Frete</h3>
            </div>

            <div className="shippingContent">
                <div>
                    <p>
                        {frete.metodo}:{' '}
                        <span>Chegará até {frete.dataEstimadaEnvio}</span>
                    </p>

                    <p className="shippingTerm">
                        Prazo de entrega: Em até {frete.prazoEntrega} dias.
                    </p>
                </div>

                <p className="shippingValue">{formatCurrency(frete.custo)}</p>
            </div>
        </div>
    );
}

ShippingInfo.propTypes = {
    frete: PropTypes.object.isRequired,
};
