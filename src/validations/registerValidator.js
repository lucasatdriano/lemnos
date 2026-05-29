export const validateRegister = (form) => {
    const errors = {};

    if (!form.name) {
        errors.name = 'Nome é obrigatório';
    } else if (form.name.length < 3) {
        errors.name = 'Nome deve ter no mínimo 3 caracteres';
    } else if (/\d/.test(form.name)) {
        errors.name = 'Nome não pode conter números';
    }

    const cpfClean = String(form.cpf).replace(/\D/g, '');
    if (!cpfClean) {
        errors.cpf = 'CPF é obrigatório';
    } else if (cpfClean.length !== 11) {
        errors.cpf = 'CPF deve ter 11 dígitos';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
        errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Digite um email válido';
    }

    if (!form.confEmail) {
        errors.confEmail = 'Confirmação de email é obrigatória';
    } else if (form.email !== form.confEmail) {
        errors.confEmail = 'Os emails devem ser iguais';
    }

    if (!form.password) {
        errors.password = 'Senha é obrigatória';
    } else if (form.password.length < 4) {
        errors.password = 'Senha deve ter no mínimo 4 caracteres';
    }

    if (!form.confPassword) {
        errors.confPassword = 'Confirmação de senha é obrigatória';
    } else if (form.password !== form.confPassword) {
        errors.confPassword = 'As senhas devem ser iguais';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};
