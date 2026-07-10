import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedAddress: {
        cep: '',
        numeroLogradouro: '',
        logradouro: '',
        uf: '',
        cidade: '',
        bairro: '',
        complemento: '',
    },
    selectedPaymentMethod: '',
    desconto: 0,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setSelectedAddress(state, action) {
            state.selectedAddress = action.payload;
        },

        setSelectedPaymentMethod(state, action) {
            state.selectedPaymentMethod = action.payload;
        },

        setDesconto(state, action) {
            state.desconto = action.payload;
        },
    },
});

export const { setSelectedAddress, setSelectedPaymentMethod, setDesconto } =
    paymentSlice.actions;

export default paymentSlice.reducer;
