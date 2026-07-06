export const SET_FRETE_INFO = 'SET_FRETE_INFO';
export const RESET_FRETE = 'RESET_FRETE';

export const setFreteInfo = (freteInfo) => ({
    type: SET_FRETE_INFO,
    payload: freteInfo,
});

export const resetFrete = () => ({
    type: RESET_FRETE,
});
