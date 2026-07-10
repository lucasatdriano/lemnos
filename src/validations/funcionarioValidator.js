export const validateFuncionario = (form, isEditing = false) => {
    const errors = {};

    if (!form.nome) {
        errors.nome = 'Nome é obrigatório';
    } else if (form.nome.length < 3) {
        errors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    const cpfClean = String(form.cpf).replace(/\D/g, '');
    if (!cpfClean) {
        errors.cpf = 'CPF é obrigatório';
    } else if (cpfClean.length !== 11) {
        errors.cpf = 'CPF deve ter 11 dígitos';
    }

    const telefoneClean = String(form.telefone).replace(/\D/g, '');
    if (!telefoneClean) {
        errors.telefone = 'Telefone é obrigatório';
    } else if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        errors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
        errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Digite um email válido';
    }

    if (!form.dataNasc) {
        errors.dataNasc = 'Data de nascimento é obrigatória';
    } else {
        const birthDate = new Date(form.dataNasc);
        const today = new Date();
        const minDate = new Date(
            today.getFullYear() - 16,
            today.getMonth(),
            today.getDate()
        );

        if (birthDate > today) {
            errors.dataNasc = 'Data de nascimento não pode ser futura';
        } else if (birthDate > minDate) {
            errors.dataNasc = 'Funcionário deve ter pelo menos 16 anos';
        }
    }

    if (!form.dataAdmissao) {
        errors.dataAdmissao = 'Data de admissão é obrigatória';
    } else {
        const admissionDate = new Date(form.dataAdmissao);
        const today = new Date();

        if (admissionDate > today) {
            errors.dataAdmissao = 'Data de admissão não pode ser futura';
        }
    }

    if (!isEditing) {
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
    } else {
        if (form.password && form.password.length < 4) {
            errors.password = 'Senha deve ter no mínimo 4 caracteres';
        }
        if (form.password || form.confPassword) {
            if (form.password !== form.confPassword) {
                errors.confPassword = 'As senhas devem ser iguais';
            }
        }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};
