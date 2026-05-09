/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { IoClose } from 'react-icons/io5';
import { RiSearch2Line } from 'react-icons/ri';
import CustomInput from '../../../../../components/inputs/customInput/Inputs';
import { useEffect, useState } from 'react';
import { listarProdutosFiltrados } from '../../../../../services/UsuarioProdutoService';

export default function UpdateProductModal({ onUpdate, onSelect, onClose }) {
    const BRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const [produtos, setProdutos] = useState([]);
    const [search, setSearch] = useState('');

    const applyFilters = async () => {
        try {
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
                5
            );
            setProdutos(produtosFiltrados);
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
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
                {produtos.length == 0 ? (
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
                        {produtos &&
                            produtos.map((produto, index) => (
                                <li
                                    className="itemUpdate"
                                    key={index}
                                    onClick={() => {
                                        onSelect(produto);
                                        onUpdate(produto);
                                    }}
                                >
                                    <img
                                        src={produto.imagemPrincipal}
                                        alt={produto.nome}
                                    />
                                    <div>
                                        <p>
                                            Produto: <span>{produto.nome}</span>
                                        </p>
                                        <p>
                                            Preço:{' '}
                                            <span>
                                                {BRL.format(produto.valorTotal)}
                                            </span>
                                        </p>
                                        <p>
                                            Desconto:{' '}
                                            <span>{produto.desconto}%</span>
                                        </p>
                                        <p>
                                            Preço c/ Desconto:{' '}
                                            <span>
                                                {BRL.format(
                                                    produto.valorComDesconto
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            Categoria:{' '}
                                            <span>{produto.categoria}</span>
                                        </p>
                                        <p>
                                            SubCategoria:{' '}
                                            <span>{produto.subCategoria}</span>
                                        </p>
                                        <p>
                                            Marca:{' '}
                                            <span>{produto.fabricante}</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
                <IoClose onClick={onClose} className="iconClose" />
            </div>
        </div>
    );
}
