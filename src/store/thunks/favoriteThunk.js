import { createAsyncThunk } from '@reduxjs/toolkit';
import { listarProdutosFavoritos } from '../../services/UsuarioProdutoService';

export const loadFavorites = createAsyncThunk(
    'favorite/loadFavorites',

    async () => {
        const favorites = await listarProdutosFavoritos();

        return favorites;
    }
);
