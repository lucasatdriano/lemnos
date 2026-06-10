import PropTypes from 'prop-types';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TbPackageExport } from 'react-icons/tb';
import { FaCheckCircle } from 'react-icons/fa';
import { FaRoute, FaTruckFast } from 'react-icons/fa6';
import { LuPackageCheck } from 'react-icons/lu';

import AuthService from '../../../../services/AuthService';
import './orderTracking.scss';

export default function OrderTracking({ pedidoStatus }) {
    const statusStyles = (status) => {
        const currentStatus = pedidoStatus.toLowerCase();

        const inactiveColor =
            AuthService.getTheme() === 'light' ? '#686767' : '#c2c9c7';

        return {
            color:
                currentStatus === status.toLowerCase()
                    ? '#36cec4'
                    : inactiveColor,
        };
    };

    const statusList = [
        {
            icon: AiOutlineLoading3Quarters,
            title: 'Em processamento',
        },
        {
            icon: TbPackageExport,
            title: 'Enviado para a transportadora',
        },
        {
            icon: FaCheckCircle,
            title: 'Recebido pela transportadora',
        },
        {
            icon: FaRoute,
            title: 'Mercadoria em trânsito',
        },
        {
            icon: FaTruckFast,
            title: 'Mercadoria em rota de entrega',
        },
        {
            icon: LuPackageCheck,
            title: 'Entregue',
        },
    ];

    return (
        <div className="loadingOrder">
            <div className="loadingBackground">
                {statusList.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div className="loadingOrderContent" key={item.title}>
                            <Icon
                                className="iconLoadingOrder"
                                style={statusStyles(item.title)}
                            />

                            <p
                                className="statusLoadingOrder"
                                style={statusStyles(item.title)}
                            >
                                {item.title === 'Entregue'
                                    ? 'Pedido entregue'
                                    : item.title}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="loadingProgress"></div>
        </div>
    );
}

OrderTracking.propTypes = {
    pedidoStatus: PropTypes.string.isRequired,
};
