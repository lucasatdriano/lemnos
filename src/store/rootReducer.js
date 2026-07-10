import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import paymentReducer from './slices/paymentSlice';
import freteReducer from './slices/freteSlice';
import deliveryReducer from './slices/deliverySlice';
import favoriteReducer from './slices/favoriteSlice';

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    payment: paymentReducer,
    frete: freteReducer,
    delivery: deliveryReducer,
    favorite: favoriteReducer,
});

export default rootReducer;
