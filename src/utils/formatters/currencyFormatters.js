const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';

    const numericValue =
        typeof value === 'string'
            ? parseFloat(value.replace(',', '.'))
            : Number(value);

    if (Number.isNaN(numericValue)) return 'R$ 0,00';

    return currencyFormatter.format(numericValue);
};

export const formatDecimal = (value) => {
    if (!value && value !== 0) return '0,00';

    const numericValue =
        typeof value === 'string'
            ? parseFloat(value.replace(',', '.'))
            : Number(value);

    if (Number.isNaN(numericValue)) return '0,00';

    return decimalFormatter.format(numericValue);
};

export const formatCurrencyInput = (value) => {
    if (!value || typeof value !== 'string') return '';

    let digits = value.replace(/\D/g, '');

    if (!digits) return '';

    while (digits.length < 3) {
        digits = `0${digits}`;
    }

    let integerPart = digits.slice(0, -2);
    const decimalPart = digits.slice(-2);

    integerPart = integerPart.replace(/^0+/, '') || '0';
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${integerPart},${decimalPart}`;
};
