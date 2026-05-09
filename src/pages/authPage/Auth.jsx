import './auth.scss';
import User from '../userPage/User';
import AuthService from '../../services/AuthService';
import { cadastrarUsuario } from '../../services/ClienteService';

import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';

import RegistrationForm from './components/registration/RegistrationForm';
import LoginForm from './components/login/LoginForm';

export default function Auth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const [clearUserImgFlag, setClearUserImgFlag] = useState(false);

    const logoutTimerRef = useRef(null);

    useEffect(() => {
        if (AuthService.isLoggedIn()) {
            setLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (loggedIn) {
            startLogoutTimer();
        } else {
            clearLogoutTimer();
        }

        return () => clearLogoutTimer();
    }, [loggedIn]);

    const startLogoutTimer = () => {
        clearLogoutTimer();

        const token = AuthService.getToken();

        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const expTime = payload.exp * 1000;
            const currentTime = Date.now();

            const timeUntilExpiry = expTime - currentTime;

            if (timeUntilExpiry <= 0) {
                handleLogout();
                return;
            }

            logoutTimerRef.current = setTimeout(() => {
                handleLogout();

                toast.warning('Sessão expirada. Faça login novamente.');
            }, timeUntilExpiry);
        } catch (error) {
            console.error(error);
            handleLogout();
        }
    };

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const handleLogin = () => {
        if (!AuthService.isLoggedIn()) return;

        const token = AuthService.getToken();

        const payload = JSON.parse(atob(token.split('.')[1]));

        AuthService.setRole(payload.role);

        setLoggedIn(true);
    };

    const handleLogout = () => {
        AuthService.logout();

        setLoggedIn(false);

        setClearUserImgFlag((prev) => !prev);
    };

    const handleRegister = async (form) => {
        const formattedCPF = form.cpf.replace(/\D/g, '');

        const formattedForm = {
            ...form,
            cpf: formattedCPF,
        };

        try {
            await cadastrarUsuario(formattedForm);

            toast.success(`Cadastro realizado, ${form.name.split(' ')[0]}!`);

            setShowLogin(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <main className="authPage">
            {loggedIn ? (
                <User onLogout={handleLogout} clearUserImg={clearUserImgFlag} />
            ) : (
                <section className="authContainer">
                    {showLogin ? (
                        <LoginForm
                            onLogin={handleLogin}
                            onCadastroClick={() => setShowLogin(false)}
                        />
                    ) : (
                        <RegistrationForm
                            onLogin={handleLogin}
                            onRegisterSuccess={handleRegister}
                            handleBackToLogin={() => setShowLogin(true)}
                        />
                    )}
                </section>
            )}
        </main>
    );
}
