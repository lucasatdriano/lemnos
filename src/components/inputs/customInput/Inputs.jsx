/* eslint-disable react/prop-types */
import './inputs.scss';

export default function CustomInput({
    type,
    reference,
    label,
    placeholder,
    id,
    maxLength,
    minLength,
    onChange,
    name,
    pattern,
    mask,
    value,
    disabled,
}) {
    const formatCPF = (value) => {
        const cleanedValue = value.replace(/\D/g, '');
        const match = cleanedValue.match(
            /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/
        );
        if (match) {
            return !match[2]
                ? match[1]
                : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
        }
        return '';
    };

    const formatCEP = (value) => {
        const cleanedValue = value.replace(/\D/g, '');
        const match = cleanedValue.match(/^(\d{0,5})(\d{0,3})$/);
        if (match) {
            return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
        }
        return '';
    };

    const formatCNPJ = (value) => {
        const cleanedValue = value.replace(/\D/g, '');
        const match = cleanedValue.match(
            /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/
        );
        if (match) {
            return !match[2]
                ? match[1]
                : `${match[1]}.${match[2]}.${match[3]}${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`;
        }
        return '';
    };

    const formatTelefone = (value) => {
        const cleanedValue = value.replace(/\D/g, '');
        const match = cleanedValue.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
        if (match) {
            return !match[2]
                ? match[1]
                : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
        }
        return '';
    };

    const formatData = (value) => {
        const cleanedValue = value.replace(/\D/g, '');
        const match = cleanedValue.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
        if (match) {
            return !match[2]
                ? match[1]
                : `${match[1]}/${match[2]}${match[3] ? `/${match[3]}` : ''}`;
        }
        return '';
    };

    const formatPreco = (value) => {
        let cleanedValue = value.replace(/\D/g, '');

        if (cleanedValue === '') return '';

        while (cleanedValue.length < 3) {
            cleanedValue = '0' + cleanedValue;
        }

        let reais = cleanedValue.slice(0, -2);
        let centavos = cleanedValue.slice(-2);

        reais = reais.replace(/^0+/, '');
        if (reais === '') reais = '0';

        reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${reais},${centavos}`;
    };

    const handleChange = (e) => {
        let formattedValue = e.target.value;

        if (mask === 'CPF') {
            formattedValue = formatCPF(formattedValue);
        } else if (mask === 'CEP') {
            formattedValue = formatCEP(formattedValue);
        } else if (mask === 'CNPJ') {
            formattedValue = formatCNPJ(formattedValue);
        } else if (mask === 'TEL') {
            formattedValue = formatTelefone(formattedValue);
        } else if (mask === 'DATA') {
            formattedValue = formatData(formattedValue);
        } else if (mask === 'PRECO') {
            formattedValue = formatPreco(formattedValue);
        } else if (mask === 'NUMBERS') {
            formattedValue = formattedValue.replace(/\D/g, '');
        }

        onChange({ target: { name, value: formattedValue } });
    };

    let inputMode;
    if (
        mask === 'CPF' ||
        mask === 'CEP' ||
        mask === 'CNPJ' ||
        mask === 'TEL' ||
        mask === 'NUMBERS' ||
        mask === 'DATA'
    ) {
        inputMode = 'numeric';
    }

    return (
        <span className="singleInput">
            <input
                placeholder={placeholder}
                type={type}
                ref={reference}
                id={id}
                name={name}
                value={value}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                onChange={handleChange}
                onBlur={handleChange}
                disabled={disabled}
                inputMode={inputMode}
                required
            />
            <label htmlFor={id}>{label}</label>
        </span>
    );
}

CustomInput.defaultProps = {
    type: 'text',
    reference: null,
    label: '',
    maxLength: null,
    minLength: null,
    pattern: null,
    mask: null,
    disabled: false,
};
