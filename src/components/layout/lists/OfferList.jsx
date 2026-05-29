import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import './offerList.scss';
import Loading from '../loading/Loading';
import {
    listarProdutosComDesconto,
    listarProdutosFiltrados,
} from '../../../services/UsuarioProdutoService';
import CardProduct from '../../cards/cardProduct/CardProduct';

function OfferList({
    categoria = null,
    subCategoria = null,
    marca = null,
    onlyOnSale = false,
    limit = null,
}) {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevFiltersRef = useRef();
    const timeoutRef = useRef();

    useEffect(() => {
        async function fetchProdutos() {
            const filtro = {};

            if (categoria != null) filtro.categoria = categoria;
            if (subCategoria != null) filtro.subCategoria = subCategoria;
            if (marca != null) filtro.marca = marca;

            const filtersKey = JSON.stringify({ filtro, onlyOnSale, limit });
            if (prevFiltersRef.current === filtersKey) {
                setLoading(false);
                return;
            }
            prevFiltersRef.current = filtersKey;

            try {
                let produtosFinais = [];

                if (onlyOnSale) {
                    const data = await listarProdutosComDesconto();

                    produtosFinais = limit ? data.slice(0, limit) : data;
                } else {
                    let allProdutos = [];
                    let page = 0;
                    const pageSize = limit || 24;
                    let hasMore = true;

                    while (hasMore && (!limit || allProdutos.length < limit)) {
                        const data = await listarProdutosFiltrados(
                            filtro,
                            page,
                            pageSize
                        );

                        if (data && data.length > 0) {
                            allProdutos = [...allProdutos, ...data];
                            page++;

                            if (limit && allProdutos.length > limit) {
                                allProdutos = allProdutos.slice(0, limit);
                                hasMore = false;
                            }

                            if (data.length < pageSize) {
                                hasMore = false;
                            }
                        } else {
                            hasMore = false;
                        }
                    }

                    produtosFinais = allProdutos;
                }

                setProdutos(produtosFinais);
            } catch (error) {
                console.error('Erro geral:', error);
                setProdutos([]);
            } finally {
                setLoading(false);
            }
        }

        if (!onlyOnSale && !categoria && !subCategoria && !marca) {
            setProdutos([]);
            setLoading(false);
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setLoading(true);

        timeoutRef.current = setTimeout(() => {
            fetchProdutos();
        }, 300);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [categoria, subCategoria, marca, onlyOnSale, limit]);

    return (
        <div className="offersList">
            {loading ? (
                <Loading />
            ) : produtos.length === 0 ? (
                <div className="noResults">
                    <p>
                        Nenhum produto encontrado com os filtros selecionados.
                    </p>
                </div>
            ) : (
                <Splide
                    options={{
                        type: 'loop',
                        perPage: 5,
                        perMove: 1,
                        speed: 1000,
                        arrows: true,
                        gap: '2rem',
                        pagination: true,
                        autoWidth: true,
                        breakpoints: {
                            1600: { perPage: 4 },
                            1400: { perPage: 4 },
                            1200: { perPage: 3 },
                            800: { perPage: 2 },
                            500: { perPage: 1 },
                        },
                    }}
                >
                    {produtos.map((produto) => (
                        <SplideSlide key={produto.id}>
                            <CardProduct produto={produto} />
                        </SplideSlide>
                    ))}
                </Splide>
            )}
        </div>
    );
}

OfferList.propTypes = {
    categoria: PropTypes.string,
    subCategoria: PropTypes.string,
    marca: PropTypes.string,
    onlyOnSale: PropTypes.bool,
    limit: PropTypes.number,
};

export default OfferList;
