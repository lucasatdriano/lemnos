import './auth.scss';
import User from '../userPage/User';
import AuthService from '../../services/AuthService';
import { cadastrarUsuario } from '../../services/ClienteService';

import { toast } from 'react-toastify';
import { useEffect, useRef, useState, useCallback } from 'react';

import RegistrationForm from './components/registration/RegistrationForm';
import LoginForm from './components/login/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export default function Auth() {
    const { isAuthenticated, login, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(true);
    const [clearUserImgFlag, setClearUserImgFlag] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const logoutTimerRef = useRef(null);
    const inactivityIntervalRef = useRef(null);

    const handleLogout = useCallback(() => {
        AuthService.logout();

        setClearUserImgFlag((prev) => !prev);

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }

        if (inactivityIntervalRef.current) {
            clearInterval(inactivityIntervalRef.current);
            inactivityIntervalRef.current = null;
        }

        logout();
    }, [logout]);

    const clearLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const startLogoutTimer = useCallback(() => {
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
            console.error('Erro ao processar token:', error);
            handleLogout();
        }
    }, [clearLogoutTimer, handleLogout]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleActivity = () => {
            setIsActive(true);
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        inactivityIntervalRef.current = setInterval(() => {
            if (!isActive) {
                handleLogout();
                toast.warning('Sessão encerrada por inatividade.');
            }
            setIsActive(false);
        }, 60 * 1000); // 60s

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
        };
    }, [isAuthenticated, isActive, handleLogout]);

    useEffect(() => {
        if (isAuthenticated) {
            startLogoutTimer();
            setIsActive(true);
        } else {
            clearLogoutTimer();
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
        }

        return () => {
            clearLogoutTimer();
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
        };
    }, [isAuthenticated, startLogoutTimer, clearLogoutTimer]);

    const handleLogin = () => {
        if (!AuthService.isLoggedIn()) return;

        const token = AuthService.getToken();

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            AuthService.setRole(payload.role);
        } catch (error) {
            console.error('Erro ao processar token no login:', error);
        }

        login();
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
            {isAuthenticated ? (
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
