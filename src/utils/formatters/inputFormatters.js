export const formatCep = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '').slice(0, 8);

    if (digits.length > 5) {
        digits = digits.replace(/(\d{5})(\d)/, '$1-$2');
    }

    return digits;
};

export const formatCpf = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (digits.length > 6) {
        return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    }

    if (digits.length > 3) {
        return digits.replace(/(\d{3})(\d+)/, '$1.$2');
    }

    return digits;
};

export const formatCnpj = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '').slice(0, 14);

    if (digits.length === 14) {
        return digits.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    }

    if (digits.length > 8) {
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    }

    if (digits.length > 5) {
        return digits.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    }

    if (digits.length > 2) {
        return digits.replace(/(\d{2})(\d+)/, '$1.$2');
    }

    return digits;
};

export const formatPhone = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    if (digits.length > 6) {
        return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    }

    if (digits.length > 2) {
        return digits.replace(/(\d{2})(\d+)/, '($1) $2');
    }

    return digits;
};
