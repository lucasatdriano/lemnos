import PropTypes from 'prop-types';

import { formatDateToBr, formatPreco } from '../../../../utils/formatters';

export default function OrderHistoryCard({ pedido, onClick }) {
    return (
        <li onClick={onClick} className="orderCard">
            <p className="orderDate">
                <strong>Data:</strong> {formatDateToBr(pedido.dataPedido)}
            </p>

            <div className="orderDetails">
                <p>
                    <strong>Pagamento: </strong>
                    {pedido.metodoPagamento}
                </p>

                <p>
                    <strong>Status: </strong>

                    <span
                        className={
                            pedido.status === 'Entregue' ||
                            pedido.status === 'Pedido entregue'
                                ? 'greenStatus'
                                : 'statusColor'
                        }
                    >
                        {pedido.status}
                    </span>
                </p>

                <p>
                    <strong>Valor: </strong>
                    {formatPreco(pedido.valorPagamento)}
                </p>
            </div>
        </li>
    );
}

OrderHistoryCard.propTypes = {
    pedido: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};
