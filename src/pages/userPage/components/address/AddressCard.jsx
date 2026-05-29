import PropTypes from 'prop-types';
import { formatCep } from '../../../../utils/formatters';

export default function AddressCard({ endereco, isSelected, onSelect }) {
    return (
        <div
            className={`enderecoCard ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <p>
                <strong>Logradouro:</strong> {endereco.logradouro},{' '}
                {endereco.numero}
            </p>

            {endereco.complemento && (
                <p>
                    <strong>Complemento:</strong> {endereco.complemento}
                </p>
            )}

            <p>
                <strong>CEP:</strong> {formatCep(endereco.cep)}
            </p>

            <p>
                <strong>Cidade/Estado:</strong> {endereco.cidade} -{' '}
                {endereco.estado}
            </p>
        </div>
    );
}

AddressCard.propTypes = {
    endereco: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func,
};
