import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    metodo: '',
    custo: 0,
    dataEstimadaEnvio: '',
    prazoEntrega: 0,
    cep: '',
};

const freteSlice = createSlice({
    name: 'frete',
    initialState,
    reducers: {
        setFreteInfo(state, action) {
            Object.assign(state, action.payload);
        },

        resetFrete() {
            return initialState;
        },
    },
});

export const { setFreteInfo, resetFrete } = freteSlice.actions;

export default freteSlice.reducer;
