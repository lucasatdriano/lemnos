import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import AuthService from '../services/AuthService';
import { loadFavorites } from '../store/thunks/favoriteThunk';
import { clearFavorites } from '../store/slices/favoriteSlice';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [, forceUpdate] = useState(0);

    const login = async () => {
        await dispatch(loadFavorites()).unwrap();
        forceUpdate((v) => v + 1);
    };

    const logout = () => {
        AuthService.logout();
        dispatch(clearFavorites());
        forceUpdate((v) => v + 1);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated:
                    AuthService.isLoggedIn() ||
                    AuthService.isLoggedInWithGoogle(),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
