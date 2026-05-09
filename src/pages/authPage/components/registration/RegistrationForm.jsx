/* eslint-disable react/prop-types */
import { useState } from 'react';
import CustomInput from '../../../../components/inputs/customInput/Inputs';
import './registrationForm.scss';
import { FcGoogle } from 'react-icons/fc';
import {
    auth,
    googleProvider,
} from '../../../../services/configurations/FirebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { loginFirebase } from '../../../../services/LoginService';
import PasswordToggle from '../../../../components/inputs/passwordToggle/PasswordToggle';
import InputError from '../../../../components/inputs/inputError/InputError';

export default function RegistrationForm({
    onLogin,
    onCadastroSuccess,
    handleBackToLogin,
}) {
    const [form, setForm] = useState({
        name: '',
        cpf: '',
        email: '',
        confEmail: '',
        password: '',
        confPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedForm = {
            ...form,
        };

        const errors = {};

        if (!form.name) {
            errors.name = 'O campo Nome é obrigatório';
        } else if (/\d/.test(form.name)) {
            errors.name = 'O Nome não pode conter números';
        }

        const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
        if (!form.cpf.match(cpfRegex)) {
            errors.cpf = 'Digite um CPF válido';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!form.email || !form.email.match(emailRegex)) {
            errors.email = 'Digite um Email válido';
        }

        if (form.email !== form.confEmail) {
            errors.confEmail = 'Os Emails devem ser iguais';
        }

        if (!form.password || form.password.length < 8) {
            errors.password = 'A Senha deve ter no mínimo 8 caracteres';
        }

        if (!form.confPassword) {
            errors.confPassword = 'Confirmar Senha é obrigatório';
        } else if (form.password !== form.confPassword) {
            errors.confPassword = 'As Senhas devem ser iguais';
        }

        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            delete formattedForm.confPassword;
            delete formattedForm.confEmail;
            onCadastroSuccess(formattedForm);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = result.user.accessToken;
            const resultLogin = await loginFirebase(token);

            if (resultLogin) {
                onLogin({
                    email: result.user.email,
                    password: result.user.password,
                });
            }
        } catch (error) {
            console.error(
                'Error during Google login:',
                error.code,
                error.message
            );
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

    return (
        <section className="registrationForm">
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

            <div className="registrationFormDivider">
                <hr />
                <h3>OU</h3>
                <hr />
            </div>

            <form className="registrationFormContent" onSubmit={handleSubmit}>
                <h2>Crie sua Conta Lemnos</h2>
                <div className="registrationFormFields">
                    <div className="registrationFormField">
                        <CustomInput
                            type="text"
                            label="Nome Completo:"
                            id="nome"
                            name="name"
                            maxLength={40}
                            minLength={5}
                            value={form.name}
                            onChange={handleChange}
                        />
                        <InputError error={errors.name} />
                    </div>

                    <div className="registrationFormField">
                        <CustomInput
                            type="text"
                            label="CPF:"
                            id="cpf"
                            name="cpf"
                            maxLength={14}
                            minLength={14}
                            value={form.cpf}
                            mask="CPF"
                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                            onChange={handleChange}
                        />
                        <InputError error={errors.cpf} />
                    </div>

                    <div className="registrationFormField">
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

                    <div className="registrationFormField">
                        <CustomInput
                            type="text"
                            label="Confirme seu Email:"
                            id="confEmail"
                            name="confEmail"
                            maxLength={40}
                            value={form.confEmail}
                            onChange={handleChange}
                        />
                        <InputError error={errors.confEmail} />
                    </div>

                    <div className="registrationFormField">
                        <CustomInput
                            type={showPassword ? 'text' : 'password'}
                            label="Senha:"
                            id="password"
                            name="password"
                            minLength={8}
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

                    <div className="registrationFormField">
                        <CustomInput
                            type={showConfPassword ? 'text' : 'password'}
                            label="Confirme sua Senha:"
                            id="confPassword"
                            name="confPassword"
                            maxLength={16}
                            value={form.confPassword}
                            onChange={handleChange}
                        />
                        <PasswordToggle
                            visible={showConfPassword}
                            onToggle={toggleConfPasswordVisibility}
                        />
                        <InputError error={errors.confPassword} />
                    </div>
                </div>

                <div className="registrationFormActions">
                    <button type="submit">Cadastrar</button>
                    <button type="button" onClick={handleBackToLogin}>
                        Voltar para Login
                    </button>
                </div>
            </form>
        </section>
    );
}
