import './loginForm.scss';
import 'react-toastify/dist/ReactToastify.css';
import CustomInput from '../../../../components/inputs/customInput/Inputs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import {
    auth,
    googleProvider,
} from '../../../../services/configurations/FirebaseConfig';
import { login, loginFirebase } from '../../../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import PasswordToggle from '../../../../components/inputs/passwordToggle/PasswordToggle';
import InputError from '../../../../components/inputs/inputError/InputError';
import { validateLogin } from '../../../../validations/loginValidator';
import { useAuth } from '../../../../hooks/useAuth';

export default function LoginForm({ onLogin, onCadastroClick }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateLogin(form);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const loginSuccess = await login(form, navigate);

            if (loginSuccess) {
                onLogin();
                toast.success('Usuário logado');
            } else {
                toast.warning('Usuário não cadastrado.');
            }
        } catch (error) {
            console.error('Error during login:', error.code, error.message);
            toast.error('Erro ao fazer login, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const googleToken = await result.user.getIdToken();
            const loginSuccess = await loginFirebase(googleToken);

            if (loginSuccess) {
                await new Promise((resolve) => setTimeout(resolve, 200));

                if (isAuthenticated && loginSuccess) {
                    onLogin();
                    toast.success('Usuário logado com sucesso!');
                } else {
                    toast.error('Erro ao salvar dados de login');
                }
            }
        } catch (error) {
            toast.error('Erro ao fazer login com Google: ' + error.message);
            console.error('Erro ao fazer login com Google: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCadastroClick = () => {
        onCadastroClick();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="loginForm">
            <div className="loginFormGoogleSection">
                <h2>Entre com sua Conta do Google</h2>
                <div className="loginFormGoogleActions">
                    <button
                        onClick={handleGoogleLogin}
                        className="loginGoogleButton"
                        disabled={isLoading}
                    >
                        <FcGoogle className="loginGoogleIcon" />
                        Entrar com Google
                    </button>
                </div>
            </div>

            <div className="loginFormDivider">
                <hr />
                <h3>OU</h3>
                <hr />
            </div>

            <form onSubmit={handleLogin} className="loginFormContent">
                <h2>Digite seu Email e sua Senha</h2>
                <div className="loginFormFields">
                    <div className="loginFormField">
                        <CustomInput
                            type="text"
                            label="Email:"
                            id="email"
                            name="email"
                            maxLength={40}
                            value={form.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <InputError error={errors.email} />
                    </div>

                    <div className="loginFormField">
                        <CustomInput
                            type={showPassword ? 'text' : 'password'}
                            label="Senha:"
                            id="password"
                            name="password"
                            minLength={4}
                            maxLength={16}
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <PasswordToggle
                            visible={showPassword}
                            onToggle={togglePasswordVisibility}
                        />
                        <InputError error={errors.password} />
                    </div>
                </div>

                <div className="loginFormActions">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCadastroClick}
                        disabled={isLoading}
                    >
                        Cadastre-se
                    </button>
                </div>
            </form>
        </section>
    );
}

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onCadastroClick: PropTypes.func.isRequired,
};
