/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiSearch2Line } from 'react-icons/ri';
import { listarProdutosFiltrados } from '../../../services/UsuarioProdutoService';
import Loading from '../../layout/loading/Loading';
import CustomInput from '../../inputs/customInput/Inputs';
import { formatPreco } from '../../../utils/formatters';

export default function ListProductModal({ onSelect, onClose }) {
    const [produtos, setProdutos] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const applyFilters = async () => {
        try {
            setLoading(true);
            const filtro = {
                nome: search,
                categoria: null,
                subCategoria: null,
                marca: null,
                menorPreco: 0,
                maiorPreco: 50000,
            };
            const produtosFiltrados = await listarProdutosFiltrados(
                filtro,
                0,
                20
            );

            setProdutos(produtosFiltrados);
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
            className="modal produto-list-modal"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="containerModal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="headerModal">
                    <IoClose onClick={onClose} className="iconClose" />
                    <h2>Lista de Produtos</h2>
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
                ) : produtos.length == 0 ? (
                    <div className="emptyMessage">
                        <h2 className="textEmpty">
                            Produto não encontrado. Revise e tente novamente.
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
                        {produtos.map((produto, index) => (
                            <li
                                className="itemUpdate"
                                key={index}
                                onClick={() => onSelect(produto)}
                            >
                                <img
                                    src={produto.imagemPrincipal}
                                    alt={produto.nome}
                                />
                                <div>
                                    <p>
                                        <strong>Produto:</strong> {produto.nome}{' '}
                                    </p>
                                    <p>
                                        <strong>Preço Total:</strong>{' '}
                                        {formatPreco(produto.valorTotal)}
                                    </p>
                                    <p>
                                        <strong>Desconto:</strong>{' '}
                                        {produto.desconto}%
                                    </p>
                                    {produto.desconto !== '0' && (
                                        <p>
                                            <strong>Preço c/ Desconto:</strong>{' '}
                                            {formatPreco(
                                                produto.valorComDesconto
                                            )}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Categoria:</strong>{' '}
                                        {produto.categoria}
                                    </p>
                                    <p>
                                        <strong>SubCategoria:</strong>{' '}
                                        {produto.subCategoria}
                                    </p>
                                    <p>
                                        <strong>Marca:</strong>{' '}
                                        {produto.fabricante}
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
