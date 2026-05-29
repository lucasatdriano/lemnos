/* eslint-disable react/prop-types */
import './loginForm.scss';
import 'react-toastify/dist/ReactToastify.css';
import CustomInput from '../../../../components/inputs/customInput/Inputs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import {
    auth,
    googleProvider,
} from '../../../../services/configurations/FirebaseConfig';
import { login, loginFirebase } from '../../../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../../services/AuthService';
import PasswordToggle from '../../../../components/inputs/passwordToggle/PasswordToggle';
import InputError from '../../../../components/inputs/inputError/InputError';
import { validateLogin } from '../../../../validations/loginValidator';

export default function LoginForm({ onLogin, onCadastroClick }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const googleToken = await result.user.getIdToken();

            const loginSuccess = await loginFirebase(googleToken);

            console.log(await result.user.getIdToken());
            console.log(result.user);
            if (AuthService.isLoggedIn() && loginSuccess) {
                onLogin();
                toast.success('Usuário logado');
            }
        } catch (error) {
            console.error(error);
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
                        />
                        <PasswordToggle
                            visible={showPassword}
                            onToggle={togglePasswordVisibility}
                        />
                        <InputError error={errors.password} />
                    </div>
                </div>

                <div className="loginFormActions">
                    <button type="submit">Entrar</button>
                    <button type="button" onClick={handleCadastroClick}>
                        Cadastre-se
                    </button>
                </div>
            </form>
        </section>
    );
}
