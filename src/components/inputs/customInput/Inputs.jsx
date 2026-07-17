import PropTypes from 'prop-types';
import './inputs.scss';
import {
    formatCep,
    formatCnpj,
    formatCpf,
    formatDateInput,
    formatCurrencyInput,
    formatPhone,
} from '../../../utils/formatters';

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
    const formatters = {
        CPF: formatCpf,
        CEP: formatCep,
        CNPJ: formatCnpj,
        TEL: formatPhone,
        DATA: formatDateInput,
        PRECO: formatCurrencyInput,
        NUMBERS: (value) => value.replace(/\D/g, ''),
    };

    const handleChange = (e) => {
        if (!onChange) return;

        const formatter = formatters[mask];

        const formattedValue = formatter
            ? formatter(e.target.value)
            : e.target.value;

        onChange({
            target: {
                name,
                value: formattedValue,
            },
        });
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

CustomInput.propTypes = {
    type: PropTypes.string,
    reference: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    onChange: PropTypes.func,
    name: PropTypes.string,
    pattern: PropTypes.string,
    mask: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
};

CustomInput.defaultProps = {
    type: 'text',
    reference: null,
    label: '',
    maxLength: null,
    minLength: null,
    onChange: () => {},
    pattern: null,
    mask: null,
    disabled: false,
};
