import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './menuSearch.scss';
import { RiSearch2Line } from 'react-icons/ri';
import { listarProdutosFiltrados } from '../../../../../services/UsuarioProdutoService';
import { formatCurrency } from '../../../../../utils/formatters';

export default function MenuSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const inputRef = useRef(null);
    const searchProducts = useRef(null);

    const fetchProdutos = useCallback(async () => {
        try {
            const filtro = {
                nome: searchTerm ?? null,
                categoria: null,
                subCategoria: null,
                marca: null,
                menorPreco: 0,
                maiorPreco: 50000,
                avaliacao: null,
            };

            const data = await listarProdutosFiltrados(filtro, 0, 6);
            setProdutos(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setProdutos([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            const delayDebounceFn = setTimeout(() => {
                fetchProdutos();
                setShowResults(true);
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setProdutos([]);
            setShowResults(false);
        }
    }, [searchTerm, fetchProdutos]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(event.target) &&
            searchProducts.current &&
            !searchProducts.current.contains(event.target)
        ) {
            setShowResults(false);
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/productFilter?search=${searchTerm}`);

        localStorage.removeItem('category');
        localStorage.removeItem('subCategory');
        localStorage.removeItem('searchTerm');
        localStorage.removeItem('brand');
        localStorage.removeItem('evaluation');
        localStorage.removeItem('minPrice');
        localStorage.removeItem('maxPrice');

        setProdutos([]);
        setShowResults(false);
    };

    const handleSearchResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchTerm('');
        setProdutos([]);
        setShowResults(false);
    };

    return (
        <div className="searchContainer">
            <form onSubmit={handleSearch} className="inputSearch">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Pesquisar..."
                    name="search"
                    id="inputSearch"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button type="submit">
                    <RiSearch2Line className="searchIcon" />
                </button>
            </form>
            {showResults && produtos.length > 0 && (
                <ul className="searchResults" ref={searchProducts}>
                    {produtos.map((product) => (
                        <Link
                            to={`/product/${product.id}`}
                            className="itemSearch"
                            key={product.id}
                            onClick={() => handleSearchResultClick(product.id)}
                        >
                            <div className="containerVisual">
                                <img
                                    src={product.imagemPrincipal}
                                    alt={product.nome}
                                />
                                <h4>{product.nome}</h4>
                            </div>
                            <p>{formatCurrency(product.valorComDesconto)}</p>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
