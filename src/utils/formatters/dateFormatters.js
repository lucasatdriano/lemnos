export const convertToIsoDate = (value) => {
    return new Date(value).toISOString().split('T')[0];
};

export const formatBrazilianDate = (isoDate) => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const formatDateInput = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '').slice(0, 8);

    if (digits.length > 4) {
        return digits.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    if (digits.length > 2) {
        return digits.replace(/(\d{2})(\d+)/, '$1/$2');
    }

    return digits;
};
