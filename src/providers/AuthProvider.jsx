import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import AuthService from '../services/AuthService';
import { loadFavorites } from '../store/thunks/favoriteThunk';
import { clearFavorites } from '../store/slices/favoriteSlice';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthService.isLoggedIn() || AuthService.isLoggedInWithGoogle()
    );

    useEffect(() => {
        const handleAuthChange = (loggedIn) => {
            setIsAuthenticated(loggedIn);
        };

        AuthService.subscribe(handleAuthChange);

        return () => {
            AuthService.unsubscribe(handleAuthChange);
        };
    }, []);

    const login = async () => {
        await dispatch(loadFavorites()).unwrap();

        setIsAuthenticated(
            AuthService.isLoggedIn() || AuthService.isLoggedInWithGoogle()
        );
    };

    const logout = () => {
        AuthService.logout();
        dispatch(clearFavorites());
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
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
