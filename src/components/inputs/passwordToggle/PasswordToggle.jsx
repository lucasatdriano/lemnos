import PropTypes from 'prop-types';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import './passwordToggle.scss';

export default function PasswordToggle({ visible, onToggle }) {
    return visible ? (
        <FaRegEyeSlash className="passwordIcon" onClick={onToggle} />
    ) : (
        <FaRegEye className="passwordIcon" onClick={onToggle} />
    );
}

PasswordToggle.propTypes = {
    visible: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};
