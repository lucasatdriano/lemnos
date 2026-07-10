import { IoClose } from 'react-icons/io5';
import { RiSearch2Line } from 'react-icons/ri';
import CustomInput from '../../inputs/customInput/Inputs';
import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { getFornecedoresByNome } from '../../../services/FornecedorService';
import { formatCnpj, formatPhone } from '../../../utils/formatters';
import Loading from '../../layout/loading/Loading';

export default function ListFornModal({ onSelect, onClose }) {
    const [fornecedores, setFornecedores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const debounceTimer = useRef(null);

    const applyFilters = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            const fornecedoresFiltrados =
                await getFornecedoresByNome(searchTerm);
            setFornecedores(fornecedoresFiltrados);
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
            toast.error('Erro ao buscar fornecedores. Tente novamente.');
            setFornecedores([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (search.trim() === '') {
            applyFilters('');
            return;
        }

        debounceTimer.current = setTimeout(() => {
            applyFilters(search);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [search, applyFilters]);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const handleCleanFilter = () => {
        setSearch('');
    };

    return (
        <div
            className="modal fornecedor-list-modal"
            onClick={(e) => {
                onClose();
                e.stopPropagation();
            }}
        >
            <div
                className="containerModal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="headerModal">
                    <IoClose onClick={onClose} className="iconClose" />
                    <h2>Lista de Fornecedores</h2>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="inputSearch"
                    >
                        <CustomInput
                            type={'text'}
                            placeholder={'Pesquisar...'}
                            name={'search'}
                            id={'inputSearch'}
                            value={search}
                            onChange={handleChange}
                        />
                        <button type="submit" className="btnSearch">
                            <RiSearch2Line className="searchIcon" />
                        </button>
                    </form>
                </div>

                {loading ? (
                    <Loading />
                ) : fornecedores.length === 0 ? (
                    <div className="emptyMessage">
                        <h2 className="textEmpty">
                            {search.trim() !== ''
                                ? 'Nenhum fornecedor encontrado para esta busca.'
                                : 'Nenhum fornecedor cadastrado.'}
                        </h2>
                        {search.trim() !== '' && (
                            <button
                                type="button"
                                className="btnBack"
                                onClick={handleCleanFilter}
                            >
                                Limpar Filtro
                            </button>
                        )}
                    </div>
                ) : (
                    <ul className="listItens">
                        {fornecedores.map((fornecedor, index) => (
                            <li
                                className="itemUpdate"
                                key={fornecedor.id || index}
                                onClick={() => onSelect(fornecedor)}
                            >
                                <div>
                                    <p>
                                        <strong>Fornecedor:</strong>{' '}
                                        <span className="spanNome">
                                            {fornecedor.nome}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Email:</strong>{' '}
                                        <span className="spanNome">
                                            {fornecedor.email}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Telefone:</strong>{' '}
                                        <span className="spanNome">
                                            {formatPhone(
                                                fornecedor.telefone?.toString()
                                            )}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>CNPJ:</strong>{' '}
                                        <span className="spanNome">
                                            {formatCnpj(
                                                fornecedor.cnpj?.toString()
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

ListFornModal.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
