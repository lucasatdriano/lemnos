export const validateFornecedor = (form) => {
    const errors = {};

    if (!form.nome) {
        errors.nome = 'Nome do fornecedor é obrigatório';
    } else if (form.nome.length < 3) {
        errors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
        errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Digite um email válido';
    }

    const telefoneClean = String(form.telefone).replace(/\D/g, '');
    if (!telefoneClean) {
        errors.telefone = 'Telefone é obrigatório';
    } else if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        errors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    const cnpjClean = String(form.cnpj).replace(/\D/g, '');
    if (!cnpjClean) {
        errors.cnpj = 'CNPJ é obrigatório';
    } else if (cnpjClean.length !== 14) {
        errors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    const cepClean = String(form.endereco?.cep || '').replace(/\D/g, '');
    if (!cepClean) {
        errors.cep = 'CEP é obrigatório';
    } else if (cepClean.length !== 8) {
        errors.cep = 'CEP deve ter 8 dígitos';
    }

    if (!form.endereco?.numeroLogradouro) {
        errors.numeroLogradouro = 'Número do logradouro é obrigatório';
    } else if (isNaN(form.endereco.numeroLogradouro)) {
        errors.numeroLogradouro = 'Número deve ser um valor válido';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};
