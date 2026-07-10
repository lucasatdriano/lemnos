import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCarrinho(state, action) {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
            state.status = 'succeeded';
            state.error = null;
        },

        addCarrinho(state, action) {
            const novoItem = action.payload;

            const itemExistente = state.items.find(
                (item) => item.id === novoItem.id
            );

            if (itemExistente) {
                itemExistente.quantidade += novoItem.quantidade || 1;
            } else {
                state.items.push({
                    ...novoItem,
                    quantidade: novoItem.quantidade || 1,
                });
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + item.preco * item.quantidade,
                0
            );

            state.status = 'succeeded';
            state.error = null;
        },

        clearCarrinho(state) {
            state.items = [];
            state.totalAmount = 0;
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const { setCarrinho, addCarrinho, clearCarrinho } = cartSlice.actions;

export default cartSlice.reducer;
