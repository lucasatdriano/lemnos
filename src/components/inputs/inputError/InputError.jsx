import PropTypes from 'prop-types';
import './inputError.scss';

export default function InputError({ error }) {
    if (!error) return null;

    return <span className="inputFormError">{error}</span>;
}

InputError.propTypes = {
    error: PropTypes.string,
};
