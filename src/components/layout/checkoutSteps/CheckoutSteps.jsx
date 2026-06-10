import React from 'react';
import PropTypes from 'prop-types';

import { IoCart } from 'react-icons/io5';
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';

import './checkoutSteps.scss';

const stepIcons = {
    carrinho: IoCart,
    pagamento: FaCreditCard,
    confirmacao: FaCheckCircle,
};

export default function CheckoutSteps({ currentStep }) {
    const steps = [
        {
            key: 'carrinho',
            label: 'Carrinho',
        },
        {
            key: 'pagamento',
            label: 'Pagamento',
        },
        {
            key: 'confirmacao',
            label: 'Confirmação',
        },
    ];

    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    return (
        <div className="statusPay">
            {steps.map((step, index) => {
                const Icon = stepIcons[step.key];

                const isWaiting = index > currentIndex;

                return (
                    <React.Fragment key={step.key}>
                        <div
                            className={`
                                statusItem
                                ${isWaiting ? 'waiting' : ''}
                            `}
                        >
                            <Icon className="iconStatus" />

                            <p>{step.label}</p>
                        </div>

                        {index < steps.length - 1 && (
                            <span
                                className={`
                                    line
                                    ${index == currentIndex ? 'waiting' : ''}
                                `}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

CheckoutSteps.propTypes = {
    currentStep: PropTypes.oneOf(['carrinho', 'pagamento', 'confirmacao'])
        .isRequired,
};
