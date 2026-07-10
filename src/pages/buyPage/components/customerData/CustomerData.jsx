import PropTypes from 'prop-types';
import { MdInfoOutline } from 'react-icons/md';
import './customerData.scss';
import { formatCep, formatCpf } from '../../../../utils/formatters';

export default function CustomerData({ cliente, selectedAddress }) {
    return (
        <div className="personalData">
            <div className="titleContainers">
                <MdInfoOutline className="iconOrder" />
                <h3>Dados do Cliente</h3>
            </div>

            <div className="dataContainer">
                <div className="personalContainer">
                    <h4 className="titleData">Dados Pessoais</h4>

                    <div className="dataPerson">
                        <p>
                            <strong>Nome:</strong> {cliente.nome}
                        </p>
                        <p>
                            <strong>Email:</strong> {cliente.email}
                        </p>
                        <p>
                            <strong>CPF:</strong> {formatCpf(cliente.cpf)}
                        </p>
                    </div>
                </div>

                <div className="enderecoContainer">
                    <h4 className="titleData">Endereço de Entrega</h4>

                    <div className="dataEnd">
                        <p>
                            <strong>CEP:</strong>{' '}
                            {formatCep(selectedAddress.cep)}
                        </p>

                        <p>
                            <strong>Logradouro:</strong>{' '}
                            {selectedAddress.logradouro}
                        </p>

                        <p>
                            <strong>Estado:</strong> {selectedAddress.uf}
                        </p>

                        <p>
                            <strong>Bairro:</strong> {selectedAddress.bairro}
                        </p>

                        <p>
                            <strong>Cidade:</strong> {selectedAddress.cidade}
                        </p>

                        <p>
                            <strong>Número:</strong>{' '}
                            {selectedAddress.numeroLogradouro}
                        </p>

                        {selectedAddress.complemento != '' && (
                            <p>
                                <strong>Complemento:</strong>{' '}
                                {selectedAddress.complemento}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

CustomerData.propTypes = {
    cliente: PropTypes.object.isRequired,
    selectedAddress: PropTypes.object.isRequired,
};
