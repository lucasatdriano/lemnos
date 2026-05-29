export const formatCep = (value) => {
    if (!value || typeof value !== 'string') return '';

    let cep = value.replace(/\D/g, '');

    cep = cep.slice(0, 8);

    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    }

    return cep;
};

export const formatCpf = (value) => {
    if (!value || typeof value !== 'string') return '';

    let cpf = value.replace(/\D/g, '');

    cpf = cpf.slice(0, 11);

    if (cpf.length === 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 3 && cpf.length <= 6) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (cpf.length > 6 && cpf.length <= 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    }

    return cpf;
};

export const formatCnpj = (value) => {
    if (!value || typeof value !== 'string') return '';

    let cnpj = value.replace(/\D/g, '');

    cnpj = cnpj.slice(0, 14);

    if (cnpj.length === 14) {
        cnpj = cnpj.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    } else if (cnpj.length > 2 && cnpj.length <= 5) {
        cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2');
    } else if (cnpj.length > 5 && cnpj.length <= 8) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d)/, '$1.$2.$3');
    } else if (cnpj.length > 8 && cnpj.length <= 12) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d)/, '$1.$2.$3/$4');
    }

    return cnpj;
};

export const formatTelefone = (value) => {
    if (!value || typeof value !== 'string') return '';

    let telefone = value.replace(/\D/g, '');

    telefone = telefone.slice(0, 11);

    if (telefone.length === 11) {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length > 2 && telefone.length <= 6) {
        telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    } else if (telefone.length > 6 && telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
    }

    return telefone;
};

export const formatDate = (value) => {
    return new Date(value).toISOString().split('T')[0];
};

export const formatDateToBr = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
};

export const formatPrecoReal = (value) => {
    if (!value && value !== 0) return '0,00';

    let precoNumerico =
        typeof value === 'string'
            ? parseFloat(value.replace(',', '.'))
            : parseFloat(value);

    if (isNaN(precoNumerico)) return '0,00';

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(precoNumerico);
};

export const formatPreco = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';

    let precoNumerico =
        typeof value === 'string'
            ? parseFloat(value.replace(',', '.'))
            : parseFloat(value);

    if (isNaN(precoNumerico)) return '0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(precoNumerico);
};

export const formatPrecoNumerico = (value) => {
    if (!value && value !== 0) return '0,00';

    let precoStr = typeof value === 'number' ? String(value) : value;
    let preco = precoStr.replace(/\D/g, '');

    if (preco === '') return '0,00';

    let precoNumerico = (parseInt(preco) / 100).toFixed(2);

    return precoNumerico.replace('.', ',');
};

export const formatPrecoInput = (value) => {
    if (!value || typeof value !== 'string') return '';

    let preco = value.replace(/\D/g, '');

    if (preco.length === 0) return '';

    while (preco.length < 3) {
        preco = '0' + preco;
    }

    let reais = preco.slice(0, -2);
    let centavos = preco.slice(-2);

    reais = reais.replace(/^0+/, '');
    if (reais === '') reais = '0';

    reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${reais},${centavos}`;
};
