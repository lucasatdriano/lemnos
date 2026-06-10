import { SET_FRETE_INFO } from '../actions/freteActions';

const initialState = {
    metodo: '',
    custo: 0,
    dataEstimadaEnvio: '',
    prazoEntrega: 0,
    cep: '',
};

const freteReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FRETE_INFO:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default freteReducer;
