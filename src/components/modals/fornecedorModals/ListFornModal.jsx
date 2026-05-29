/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { IoClose } from 'react-icons/io5';
import { RiSearch2Line } from 'react-icons/ri';
import CustomInput from '../../inputs/customInput/Inputs';
import { useEffect, useState } from 'react';
import { getFornecedoresByNome } from '../../../services/FornecedorService';
import { formatCnpj, formatTelefone } from '../../../utils/formatters';
import Loading from '../../layout/loading/Loading';

export default function ListFornModal({ onSelect, onClose }) {
    const [fornecedores, setFornecedores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const applyFilters = async () => {
        try {
            setLoading(true);
            const fornecedoresFiltrados = await getFornecedoresByNome(search);
            if (fornecedores == fornecedoresFiltrados) return;
            setFornecedores(fornecedoresFiltrados);
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [search]);

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
                ) : fornecedores.length == 0 ? (
                    <div className="emptyMessage">
                        <h2 className="textEmpty">
                            Fornecedor não encontrado. Revise e tente novamente.
                        </h2>
                        <button
                            type="button"
                            className="btnBack"
                            onClick={handleCleanFilter}
                        >
                            Limpar Filtro
                        </button>
                    </div>
                ) : (
                    <ul className="listItens">
                        {fornecedores &&
                            fornecedores.map((fornecedor, index) => (
                                <li
                                    className="itemUpdate"
                                    key={index}
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
                                                {formatTelefone(
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
