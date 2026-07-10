import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './completedModal.scss';

export default function CompletedModal({ onClose }) {
    const navigate = useNavigate();

    const handleBuy = () => {
        onClose();
        navigate('/');
    };

    return (
        <div className="modal">
            <div className="containerModal">
                <h2>Compra realizada com sucesso!</h2>
                <hr className="hrComplete" />
                <FaCheckCircle className="iconCheck" />
                <button type="button" onClick={handleBuy} className="btnBuy">
                    Continue Comprando
                </button>
            </div>
        </div>
    );
}

CompletedModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};
