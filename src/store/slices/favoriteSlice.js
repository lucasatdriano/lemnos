import { createSlice } from '@reduxjs/toolkit';
import { loadFavorites } from '../thunks/favoriteThunk';

const initialState = {
    items: [],
    loading: false,
};

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addFavorite(state, action) {
            state.items.push(action.payload);
        },

        removeFavorite(state, action) {
            state.items = state.items.filter(
                (favorite) => favorite.id !== action.payload
            );
        },

        clearFavorites(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFavorites.pending, (state) => {
                state.loading = true;
            })

            .addCase(loadFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(loadFavorites.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const {
    setFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    setLoading,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
