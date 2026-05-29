import PropTypes from 'prop-types';

import AddressCard from './AddressCard';

export default function AddressList({
    enderecos,
    selectedEndereco,
    onSelectEndereco,
    onDeleteEndereco,
    onAddEndereco,
    isCliente,
}) {
    if (!enderecos.length) {
        return (
            <div className="enderecoSection">
                <div className="sectionHeader">
                    <h3>Nenhum endereço cadastrado</h3>

                    {isCliente ? (
                        <p className="helperText">
                            Adicione um endereço para facilitar suas compras!
                        </p>
                    ) : (
                        <p className="helperText">
                            Adicione um endereço para melhor controle da conta!
                        </p>
                    )}

                    <button
                        type="button"
                        className="addButton"
                        onClick={onAddEndereco}
                    >
                        Adicionar Endereço
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="enderecoSection">
            {enderecos.map((endereco, index) => (
                <AddressCard
                    key={index}
                    endereco={endereco}
                    isSelected={selectedEndereco === index}
                    onSelect={() => onSelectEndereco(index)}
                />
            ))}

            <div className="enderecoActionsButtons">
                {selectedEndereco !== null && (
                    <button
                        type="button"
                        className="deleteButton"
                        onClick={onDeleteEndereco}
                    >
                        Apagar Endereço
                    </button>
                )}

                {enderecos.length < 3 && (
                    <button
                        type="button"
                        className="addButton"
                        onClick={onAddEndereco}
                    >
                        Adicionar Outro Endereço
                    </button>
                )}
            </div>
        </div>
    );
}

AddressList.propTypes = {
    enderecos: PropTypes.array.isRequired,
    selectedEndereco: PropTypes.number,
    onSelectEndereco: PropTypes.func.isRequired,
    onDeleteEndereco: PropTypes.func.isRequired,
    onAddEndereco: PropTypes.func.isRequired,
    isCliente: PropTypes.bool,
};
