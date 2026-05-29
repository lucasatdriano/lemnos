/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { IoList } from 'react-icons/io5';
import { HiSquares2X2 } from 'react-icons/hi2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DoubleInputRange from '../../components/inputs/doubleInput/DoubleInput';
import Loading from '../../components/layout/loading/Loading';
import AuthService from '../../services/AuthService';
import './productFilter.scss';
import { listarProdutosFiltrados } from '../../services/UsuarioProdutoService';
import CardProduct from '../../components/cards/cardProduct/CardProduct';

import {
    FILTER_BRANDS,
    FILTER_CATEGORIES,
    FILTER_SUBCATEGORIES,
} from '../../constants/filters';

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
        evaluation: localStorage.getItem('evaluation') || '',
    });

    const [calculatedMaxPrice, setCalculatedMaxPrice] = useState(
        filters.maxPrice
    );

    const saveFiltersToLocalStorage = () => {
        Object.entries(filters).forEach(([key, value]) =>
            localStorage.setItem(key, value.toString())
        );
    };

    const clearFiltersFromLocalStorage = () => {
        Object.entries(filters).forEach(([key]) =>
            localStorage.removeItem(key)
        );
    };

    const calculateMaxPrice = async () => {
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
    };

    const applyFilters = async (pageToLoad = 0) => {
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
    };

    useEffect(() => {
        calculateMaxPrice();
    }, [
        filters.brand,
        filters.category,
        filters.subCategory,
        filters.searchTerm,
        filters.evaluation,
    ]);

    useEffect(() => {
        applyFilters(0);
    }, [
        filters.brand,
        filters.category,
        filters.subCategory,
        filters.minPrice,
        filters.maxPrice,
        filters.searchTerm,
        filters.evaluation,
    ]);

    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        };

        if (endOfPageRef.current) {
            observer.current = new IntersectionObserver(handleObserver);
            observer.current.observe(endOfPageRef.current);
        }

        return () => {
            if (observer.current && endOfPageRef.current) {
                observer.current.unobserve(endOfPageRef.current);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (page > 0) {
            applyFilters(page);
        }
    }, [page]);

    const handleClearFilters = () => {
        setFilters((prev) => ({
            ...prev,
            brand: '',
            subCategory: '',
            minPrice: 0,
            maxPrice: 50000,
            evaluation: 0,
            searchTerm: '',
            category: '',
        }));
        setPage(0);
        setHasMore(true);
        clearFiltersFromLocalStorage();
        navigate(`/productFilter`);
    };

    const handleCategoryChange = (e) => {
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
    };

    const handleProductRating = (rating) => {
        setFilters((prev) => ({
            ...prev,
            evaluation: rating === prev.evaluation ? '' : rating,
        }));
        setPage(0);
    };

    const handleAlterCardsView = (bool) => {
        setCardList(bool);
        AuthService.setCard(bool);
        applyFilters();
    };

    return (
        <section className="mainFilters">
            <section className="product-filter-container">
                <div className="containerAlterFilter">
                    <p className="containerChecked">
                        <input
                            type="radio"
                            id="listView"
                            name="view"
                            checked={cardList}
                            onChange={() => handleAlterCardsView(true)}
                        />
                        <label htmlFor="listView" className="labelIcon">
                            <IoList className="iconAlter" />
                        </label>
                    </p>

                    <p className="containerChecked">
                        <input
                            type="radio"
                            id="gridView"
                            name="view"
                            checked={!cardList}
                            onChange={() => handleAlterCardsView(false)}
                        />
                        <label htmlFor="gridView" className="labelIcon">
                            <HiSquares2X2 className="iconAlter" />
                        </label>
                    </p>
                </div>

                <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Todas as Categorias</option>
                    {FILTER_CATEGORIES.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.subCategory}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            subCategory: e.target.value,
                        }))
                    }
                >
                    <option value="">Todas as SubCategorias</option>
                    {FILTER_SUBCATEGORIES[filters.category]?.map(
                        (subcategoria) => (
                            <option key={subcategoria} value={subcategoria}>
                                {subcategoria}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={filters.brand}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            brand: e.target.value,
                        }))
                    }
                >
                    <option value="">Todas as Marcas</option>
                    {FILTER_BRANDS.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>

                <DoubleInputRange
                    key={filters.maxPrice}
                    minValue={filters.minPrice}
                    maxValue={filters.maxPrice}
                    setMinValue={(minPrice) =>
                        setFilters((prev) => ({ ...prev, minPrice }))
                    }
                    setMaxValue={(maxPrice) =>
                        setFilters((prev) => ({ ...prev, maxPrice }))
                    }
                    maxPrice={calculatedMaxPrice}
                />

                <div className="ratingFilter">
                    {[5, 4, 3, 2, 1].map((index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`star-${index}`}
                                name="star-rating"
                                value={index}
                                checked={index === filters.evaluation}
                                onChange={() => handleProductRating(index)}
                            />
                            <label htmlFor={`star-${index}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={
                                        index <= filters.evaluation
                                            ? 'filled'
                                            : ''
                                    }
                                >
                                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                                </svg>
                            </label>
                        </React.Fragment>
                    ))}
                </div>
            </section>

            <section className="filtered-data-container">
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
