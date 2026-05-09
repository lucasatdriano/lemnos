export const formatCep = (value) => {
    let cep = value.replace(/\D/g, '');

    cep = cep.slice(0, 8);

    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    }

    return cep;
};

export const formatCpf = (value) => {
    let cpf = value.replace(/\D/g, '');

    cpf = cpf.slice(0, 11);

    if (cpf.length === 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return cpf;
};
