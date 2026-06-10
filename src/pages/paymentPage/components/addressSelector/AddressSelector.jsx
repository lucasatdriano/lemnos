import PropTypes from 'prop-types';
import './addressSelector.scss';
import { formatCep } from '../../../../utils/formatters';

export default function AddressSelector({
    addresses,
    selectedAddress,
    onChange,
    onOpenModal,
}) {
    return (
        <div className="containerAddress">
            {addresses.length === 0 ? (
                <div className="noAddressContainer">
                    <p className="textAddress">Nenhum endereço cadastrado</p>
                    <button
                        type="button"
                        className="addAddressButton"
                        onClick={onOpenModal}
                    >
                        Adicionar Endereço
                    </button>
                </div>
            ) : (
                <>
                    <p className="textAddress">
                        Selecione o Endereço de Entrega:
                    </p>
                    <div className="addressOptionsContainer">
                        {addresses.map((endereco, index) => (
                            <div key={index} className="addressCard">
                                <input
                                    type="radio"
                                    name="addressSelect"
                                    id={`address_${endereco.cep}`}
                                    value={endereco.cep}
                                    checked={
                                        selectedAddress?.cep === endereco.cep
                                    }
                                    onChange={onChange}
                                />
                                <label
                                    htmlFor={`address_${endereco.cep}`}
                                    className="addressLabel"
                                >
                                    <div className="addressInfo">
                                        <div className="addressMainInfo">
                                            <span className="addressCep">
                                                {formatCep(endereco.cep)}
                                            </span>
                                            <span className="addressStreet">
                                                {endereco.logradouro},{' '}
                                                {endereco.numeroLogradouro}
                                            </span>
                                        </div>
                                        <div className="addressSecondaryInfo">
                                            <span className="addressNeighborhood">
                                                {endereco.bairro}
                                            </span>
                                            <span className="addressCity">
                                                {endereco.cidade} -{' '}
                                                {endereco.uf}
                                            </span>
                                        </div>
                                        {endereco.complemento && (
                                            <span className="addressComplement">
                                                {endereco.complemento}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

AddressSelector.propTypes = {
    addresses: PropTypes.array.isRequired,
    selectedAddress: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func,
};
