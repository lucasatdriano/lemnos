import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../../components/layout/loading/Loading';
import AuthService from '../../services/AuthService';
import { listarProdutosFiltrados } from '../../services/UsuarioProdutoService';
import CardProduct from '../../components/cards/cardProduct/CardProduct';
import FiltersProducts from './components/filtersProducts/FiltersProducts';
import './productFilter.scss';

export default function ProductFilter() {
    const navigate = useNavigate();
    const location = useLocation();
    const endOfPageRef = useRef();
    const observer = useRef();
    const { category } = useParams();
    const [filteredData, setFilteredData] = useState([]);
    const [cardList, setCardList] = useState(AuthService.getCard() === 'true');
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const search = new URLSearchParams(location.search).get('search') || '';

    const [filters, setFilters] = useState({
        searchTerm: localStorage.getItem('searchTerm') || search || '',
        category: localStorage.getItem('category') || category || '',
        subCategory: localStorage.getItem('subCategory') || '',
        brand: localStorage.getItem('brand') || '',
        minPrice: parseInt(localStorage.getItem('minPrice')) || 0,
        maxPrice: parseInt(localStorage.getItem('maxPrice')) || 50000,
        evaluation: parseInt(localStorage.getItem('evaluation')) || null,
    });

    const [calculatedMaxPrice, setCalculatedMaxPrice] = useState(
        filters.maxPrice
    );

    const saveFiltersToLocalStorage = useCallback(() => {
        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === '') {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value.toString());
            }
        });
    }, [filters]);

    const clearFiltersFromLocalStorage = useCallback(() => {
        Object.entries(filters).forEach(([key]) =>
            localStorage.removeItem(key)
        );
    }, [filters]);

    const calculateMaxPrice = useCallback(async () => {
        try {
            const filtro = {
                nome: filters.searchTerm ?? null,
                categoria: filters.category ?? null,
                subCategoria: filters.subCategory ?? null,
                marca: filters.brand ?? null,
                menorPreco: null,
                maiorPreco: null,
                avaliacao: filters.evaluation
                    ? parseInt(filters.evaluation, 10)
                    : null,
            };

            const produtosFiltrados = await listarProdutosFiltrados(
                filtro,
                0,
                1000
            );

            const novoMaxPrice = produtosFiltrados.reduce(
                (max, produto) =>
                    produto.valorComDesconto > max
                        ? produto.valorComDesconto
                        : max,
                0
            );

            const safeMaxPrice = novoMaxPrice <= 0 ? 100 : novoMaxPrice;

            setCalculatedMaxPrice(safeMaxPrice);

            setFilters((prev) => ({
                ...prev,
                maxPrice: safeMaxPrice,
            }));
        } catch (error) {
            console.error('Erro ao calcular o maior preço:', error);
        }
    }, [
        filters.brand,
        filters.category,
        filters.subCategory,
        filters.searchTerm,
        filters.evaluation,
    ]);

    const applyFilters = useCallback(
        async (pageToLoad = 0) => {
            setLoading(true);
            saveFiltersToLocalStorage();
            try {
                const filtro = {
                    nome: filters.searchTerm ?? null,
                    categoria: filters.category ?? null,
                    subCategoria: filters.subCategory ?? null,
                    marca: filters.brand ?? null,
                    menorPreco: filters.minPrice ?? 0,
                    maiorPreco: filters.maxPrice ?? 50000,
                    avaliacao: filters.evaluation
                        ? parseInt(filters.evaluation, 10)
                        : null,
                };

                const produtosFiltrados = await listarProdutosFiltrados(
                    filtro,
                    pageToLoad,
                    24
                );

                setFilteredData((prevData) =>
                    pageToLoad === 0
                        ? produtosFiltrados
                        : [...prevData, ...produtosFiltrados]
                );
                setHasMore(produtosFiltrados.length === 24);
            } catch (error) {
                console.error('Erro ao aplicar filtros:', error);
            } finally {
                setLoading(false);
            }
        },
        [filters, saveFiltersToLocalStorage]
    );

    useEffect(() => {
        calculateMaxPrice();
    }, [calculateMaxPrice]);

    useEffect(() => {
        applyFilters(0);
    }, [applyFilters]);

    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        };

        const currentElement = endOfPageRef.current;

        if (currentElement) {
            observer.current = new IntersectionObserver(handleObserver);
            observer.current.observe(currentElement);
        }

        return () => {
            if (observer.current && currentElement) {
                observer.current.unobserve(currentElement);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (page > 0) {
            applyFilters(page);
        }
    }, [page, applyFilters]);

    const handleClearFilters = useCallback(() => {
        setFilters((prev) => ({
            ...prev,
            brand: '',
            subCategory: '',
            minPrice: 0,
            maxPrice: calculatedMaxPrice,
            evaluation: null,
            searchTerm: '',
            category: '',
        }));
        setPage(0);
        setHasMore(true);
        clearFiltersFromLocalStorage();
        navigate(`/productFilter`);
    }, [calculatedMaxPrice, clearFiltersFromLocalStorage, navigate]);

    const handleCategoryChange = useCallback(
        (e) => {
            const newCategory = e.target.value;
            setFilters((prev) => ({
                ...prev,
                category: newCategory,
                subCategory: '',
            }));
            setPage(0);

            localStorage.removeItem('subCategory');

            const searchTerm =
                new URLSearchParams(location.search).get('search') || '';

            setTimeout(() => {
                navigate(
                    `/productFilter/${newCategory}${searchTerm ? `?search=${searchTerm}` : ''}`
                );
            }, 0);
        },
        [location.search, navigate]
    );

    const handleProductRating = useCallback((rating) => {
        setFilters((prev) => ({
            ...prev,
            evaluation: prev.evaluation === rating ? null : rating,
        }));
        setPage(0);
    }, []);

    const handleAlterCardsView = useCallback(
        (bool) => {
            setCardList(bool);
            AuthService.setCard(bool);
            applyFilters(0);
        },
        [applyFilters]
    );

    return (
        <section className="mainFilters">
            <FiltersProducts
                cardList={cardList}
                handleAlterCardsView={handleAlterCardsView}
                filters={filters}
                handleCategoryChange={handleCategoryChange}
                setFilters={setFilters}
                calculatedMaxPrice={calculatedMaxPrice}
                handleProductRating={handleProductRating}
            />

            <section className="filteredDataContainer">
                {loading && page === 0 ? (
                    <Loading />
                ) : (
                    <>
                        {filteredData.length === 0 && (
                            <div className="emptyFilterMessage">
                                <h2 className="textEmpty">
                                    Parece que não há resultados para os filtros
                                    escolhidos. Por favor, revise suas opções e
                                    tente novamente.
                                </h2>
                                <button
                                    type="button"
                                    className="btnBackFilter"
                                    onClick={handleClearFilters}
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}

                        {filteredData.length > 0 && (
                            <>
                                <div
                                    className={`productsList ${cardList ? 'cardList' : ''}`}
                                >
                                    {filteredData.map((produto) => (
                                        <CardProduct
                                            key={produto.id}
                                            produto={produto}
                                        />
                                    ))}
                                </div>
                                {loading && (
                                    <div className="loadingProducts">
                                        <Loading />
                                    </div>
                                )}
                                <div
                                    ref={endOfPageRef}
                                    className="end-of-page"
                                ></div>
                            </>
                        )}
                    </>
                )}
            </section>
        </section>
    );
}
