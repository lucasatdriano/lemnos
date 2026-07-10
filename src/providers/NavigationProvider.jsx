import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavigationContext } from '../contexts/NavigationContext';

export const NavigationProvider = ({ children }) => {
    const [isNavigatingToPayment, setIsNavigatingToPayment] = useState(false);
    const [isNavigatingToBuy, setIsNavigatingToBuy] = useState(false);

    const navigationState = {
        isNavigatingToPayment,
        setIsNavigatingToPayment,
        isNavigatingToBuy,
        setIsNavigatingToBuy,
    };

    return (
        <NavigationContext.Provider value={navigationState}>
            {children}
        </NavigationContext.Provider>
    );
};

NavigationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
