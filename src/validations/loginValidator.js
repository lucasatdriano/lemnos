export const validateLogin = (form) => {
    const errors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
        errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Digite um email válido';
    }

    if (!form.password) {
        errors.password = 'Senha é obrigatória';
    } else if (form.password.length < 4) {
        errors.password = 'Senha deve ter no mínimo 4 caracteres';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};
