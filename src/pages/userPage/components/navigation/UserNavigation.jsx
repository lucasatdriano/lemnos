import PropTypes from 'prop-types';
import './userNavigation.scss';

export default function UserNavigation({ view, setView, isAdmin, isCliente }) {
    return (
        <div className="selectButtons">
            {!isAdmin && (
                <button
                    type="button"
                    className={`${
                        view === 'endereco' ? 'selected' : ''
                    } viewButton`}
                    onClick={() => setView('endereco')}
                >
                    Endereços
                </button>
            )}

            <button
                type="button"
                className={`${
                    view === 'fornecedores' ? 'selected' : ''
                } viewButton`}
                onClick={() => setView(isCliente ? 'pedidos' : 'fornecedores')}
            >
                {isCliente ? 'Pedidos' : 'Fornecedores'}
            </button>

            {isAdmin && (
                <button
                    type="button"
                    className={`${
                        view === 'funcionarios' ? 'selected' : ''
                    } viewButton`}
                    onClick={() => setView('funcionarios')}
                >
                    Funcionários
                </button>
            )}

            {!isCliente && (
                <button
                    type="button"
                    className={`${
                        view === 'produtos' ? 'selected' : ''
                    } viewButton`}
                    onClick={() => setView('produtos')}
                >
                    Produtos
                </button>
            )}
        </div>
    );
}

UserNavigation.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isCliente: PropTypes.bool.isRequired,
};
