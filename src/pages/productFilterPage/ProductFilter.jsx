/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { IoList } from 'react-icons/io5';
import { HiSquares2X2 } from 'react-icons/hi2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/card/Card';
import Loading from '../../components/loading/Loading';
import DoubleInputRange from '../../components/inputs/doubleInput/DoubleInput';
import AuthService from '../../services/AuthService';
import './productFilter.scss';
import { listarProdutosFiltrados } from '../../services/UsuarioProdutoService';

const brands = [
    'Acer',
    'AMD',
    'Apple',
    'Asus',
    'Dell',
    'Gigabyte',
    'Logitech',
    'Intel',
    'JBL',
    'Lenovo',
    'LG',
    'Microsoft',
    'NVIDIA',
    'Philips',
    'Positivo',
    'Samsung',
    'Sony',
    'Xiaomi',
];

const categorias = [
    'Casa Inteligente',
    'Computadores',
    'Eletrônicos',
    'Hardware',
    'Kits',
    'Monitores',
    'Notebooks e Portáteis',
    'Periféricos',
    'Realidade Virtual',
    'Redes e wireless',
    'Video Games',
];

const subcategoriasPorCategoria = {
    'Casa Inteligente': [
        'Assistente Virtual',
        'Controles Smarts',
        'Lâmpadas Inteligentes',
        'Sensores',
    ],
    Computadores: ['Computadores Gamers', 'Computadores Workstation'],
    Eletrônicos: [
        'Acessórios de Console',
        'Carregadores',
        'Refrigeração',
        'Smart Box',
    ],
    Hardware: [
        'Armazenamento',
        'Coolers',
        'Fonte',
        'Memória RAM',
        'Placa de Vídeo',
        'Placa Mãe',
        'Processadores',
    ],
    Kits: ['Gamer', 'Periféricos', 'Upgrade'],
    Monitores: ['Monitores Gamers', 'Monitores Workstation'],
    'Notebooks e Portáteis': ['Notebooks', 'Smartphones', 'Tablets'],
    Periféricos: [
        'Caixa de Som',
        'Fone de Ouvido',
        'Microfone',
        'Mouse',
        'Mousepad',
        'Teclado',
    ],
    'Realidade Virtual': ['Óculos de VR', 'Periféricos de VR'],
    'Redes e wireless': [
        'Access Point',
        'Adaptadores',
        'Cabos',
        'Cabos de Redes',
        'Roteadores',
        'Switches',
    ],
    'Video Games': ['Console de Mesa', 'Portátil'],
};

export default function ProductFilter() {
    const { category } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';

    const [selectedBrand, setSelectedBrand] = useState(
        localStorage.getItem('selectedBrand') || ''
    );
    const [selectedEvaluation, setSelectedEvaluation] = useState(
        localStorage.getItem('selectedEvaluation') || ''
    );
    const [selectedCategory, setSelectedCategory] = useState(
        localStorage.getItem('selectedCategory') || category || ''
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState(
        localStorage.getItem('selectedSubCategory') || ''
    );
    const [minPrice, setMinPrice] = useState(
        parseInt(localStorage.getItem('minPrice')) || 0
    );
    const [maxPrice, setMaxPrice] = useState(
        parseInt(localStorage.getItem('maxPrice')) || 50000
    );
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem('searchTerm') || search || ''
    );
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cardList, setCardList] = useState(AuthService.getCard() === 'true');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const endOfPageRef = useRef();
    const observer = useRef();

    const saveFiltersToLocalStorage = () => {
        localStorage.setItem('selectedBrand', selectedBrand);
        localStorage.setItem('selectedEvaluation', selectedEvaluation);
        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('selectedSubCategory', selectedSubCategory);
        localStorage.setItem('minPrice', minPrice.toString());
        localStorage.setItem('maxPrice', maxPrice.toString());
        localStorage.setItem('searchTerm', searchTerm);
    };

    const calculateMaxPrice = async () => {
        try {
            const filtro = {
                nome: searchTerm ?? null,
                categoria: selectedCategory ?? null,
                subCategoria: selectedSubCategory ?? null,
                marca: selectedBrand ?? null,
                menorPreco: null,
                maiorPreco: null,
                avaliacao: selectedEvaluation
                    ? parseInt(selectedEvaluation, 10)
                    : null,
            };

            const produtosFiltrados = await listarProdutosFiltrados(
                filtro,
                0,
                1000
            );
            const novoMaxPrice = produtosFiltrados.reduce((max, produto) => {
                return produto.valorComDesconto > max
                    ? produto.valorComDesconto
                    : max;
            }, 0);

            setMaxPrice(novoMaxPrice);
        } catch (error) {
            console.error('Erro ao calcular o maior preço:', error);
        }
    };

    const applyFilters = async (pageToLoad = 0) => {
        setLoading(true);
        saveFiltersToLocalStorage();
        try {
            const filtro = {
                nome: searchTerm ?? null,
                categoria: selectedCategory ?? null,
                subCategoria: selectedSubCategory ?? null,
                marca: selectedBrand ?? null,
                menorPreco: minPrice ?? 0,
                maiorPreco: maxPrice ?? 50000,
                avaliacao: selectedEvaluation
                    ? parseInt(selectedEvaluation, 10)
                    : null,
            };

            const produtosFiltrados = await listarProdutosFiltrados(
                filtro,
                pageToLoad,
                24
            );

            if (pageToLoad === 0) {
                setFilteredData(produtosFiltrados);
            } else {
                setFilteredData((prevData) => [
                    ...prevData,
                    ...produtosFiltrados,
                ]);
            }
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
        selectedBrand,
        selectedCategory,
        selectedSubCategory,
        searchTerm,
        selectedEvaluation,
    ]);

    useEffect(() => {
        applyFilters(0);
    }, [
        selectedBrand,
        selectedCategory,
        selectedSubCategory,
        minPrice,
        searchTerm,
        selectedEvaluation,
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
        setSelectedBrand('');
        setSelectedSubCategory('');
        setMinPrice(0);
        setMaxPrice(50000);
        setSelectedEvaluation('');
        setSearchTerm('');
        setSelectedCategory('');
        setPage(0);
        setHasMore(true);
        localStorage.clear();
        navigate(`/productFilter`);
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        setPage(0);
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get('search') || '';
        navigate(
            `/productFilter/${newCategory}${searchTerm ? `?search=${searchTerm}` : ''}`
        );
    };

    const handleProductRating = (rating) => {
        if (rating === selectedEvaluation) {
            setSelectedEvaluation('');
        } else {
            setSelectedEvaluation(rating);
        }
        setPage(0);
    };

    const handleAlterCardsList = () => {
        setCardList(true);
        AuthService.setCard('true');
        applyFilters();
    };

    const handleAlterCardsSquare = () => {
        setCardList(false);
        AuthService.setCard('false');
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
                            onChange={handleAlterCardsList}
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
                            onChange={handleAlterCardsSquare}
                        />
                        <label htmlFor="gridView" className="labelIcon">
                            <HiSquares2X2 className="iconAlter" />
                        </label>
                    </p>
                </div>

                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Todas as Categorias</option>
                    {categorias.map((categoria, index) => (
                        <option key={index} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                >
                    <option value="">Todas as SubCategorias</option>
                    {(subcategoriasPorCategoria[selectedCategory] || []).map(
                        (subcategoria, index) => (
                            <option key={index} value={subcategoria}>
                                {subcategoria}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                >
                    <option value="">Todas as Marcas</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>

                <DoubleInputRange
                    minValue={minPrice}
                    maxValue={maxPrice}
                    setMinValue={setMinPrice}
                    setMaxValue={setMaxPrice}
                    maxPrice={maxPrice}
                />

                <div className="ratingFilter">
                    {[5, 4, 3, 2, 1].map((index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`star-${index}`}
                                name="star-rating"
                                value={index}
                                checked={index === selectedEvaluation}
                                onChange={() => handleProductRating(index)}
                            />
                            <label htmlFor={`star-${index}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={
                                        index <= selectedEvaluation
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
                                        <Card
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
