import { useState, useEffect, useRef, useCallback } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { Link } from 'react-router-dom';
import './carousel.scss';
import PropTypes from 'prop-types';
import { listarProdutosFiltrados } from '../../../../services/UsuarioProdutoService';

import imgBanner1 from '../../../../assets/banners/banner1.webp';
import imgBanner2 from '../../../../assets/banners/banner2.webp';
import imgBanner3 from '../../../../assets/banners/banner3.webp';
import imgBanner4 from '../../../../assets/banners/banner4.webp';
import imgBanner5 from '../../../../assets/banners/banner5.webp';

import imgBannerMob1 from '../../../../assets/banners/bannerMob1.webp';
import imgBannerMob2 from '../../../../assets/banners/bannerMob2.webp';
import imgBannerMob3 from '../../../../assets/banners/bannerMob3.webp';
import imgBannerMob4 from '../../../../assets/banners/bannerMob4.webp';
import imgBannerMob5 from '../../../../assets/banners/bannerMob5.webp';

const bannersConfig = [
    {
        desktop: imgBanner1,
        mobile: imgBannerMob1,
        productName: 'Lemnos',
    },
    {
        desktop: imgBanner2,
        mobile: imgBannerMob2,
        productName: 'Earbuds Basic Global Mi True Wireless',
    },
    {
        desktop: imgBanner3,
        mobile: imgBannerMob3,
        productName: 'Headphone over-ear Bluetooth WB Siren Pro ANC',
    },
    {
        desktop: imgBanner4,
        mobile: imgBannerMob4,
        productName: 'Notebook Acer Aspire 5, 256GB, Tela 15/6',
    },
    {
        desktop: imgBanner5,
        mobile: imgBannerMob5,
        productName: 'Apple Watch Ultra 2',
    },
];

const ResponsiveImage = ({ desktop, mobile, alt }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <picture>
            <source media="(max-width: 768px)" srcSet={mobile} />
            <img
                src={desktop}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                style={{
                    filter: isLoaded ? 'none' : 'blur(10px)',
                    transition: 'filter 0.8s ease-out',
                }}
            />
        </picture>
    );
};

export default function Slide() {
    const splideRef = useRef(null);
    const [autoplayPaused, setAutoplayPaused] = useState(false);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const productIdCache = useRef(new Map());

    const fetchProductIdByName = useCallback(async (productName) => {
        if (productIdCache.current.has(productName)) {
            return productIdCache.current.get(productName);
        }

        try {
            const filtro = {
                nome: productName,
                categoria: null,
                subCategoria: null,
                marca: null,
                menorPreco: 0,
                maiorPreco: 50000,
                avaliacao: null,
            };

            const data = await listarProdutosFiltrados(filtro, 0, 1);

            let productId = null;

            if (data && Array.isArray(data) && data.length > 0) {
                productId = data[0].id;
            }

            productIdCache.current.set(productName, productId);
            return productId;
        } catch (error) {
            console.error(`Erro ao buscar produto ${productName}:`, error);
            productIdCache.current.set(productName, null);
            return null;
        }
    }, []);

    useEffect(() => {
        async function loadSlides() {
            setLoading(true);
            const slidesData = await Promise.all(
                bannersConfig.map(async (config) => {
                    const productId = await fetchProductIdByName(
                        config.productName
                    );
                    return {
                        desktop: config.desktop,
                        mobile: config.mobile,
                        link: productId ? `/product/${productId}` : '#',
                        productName: config.productName,
                        hasProduct: !!productId,
                    };
                })
            );

            setSlides(slidesData);
            setLoading(false);
        }

        loadSlides();
    }, [fetchProductIdByName]);

    const nextSlide = () => {
        splideRef.current?.splide.go('+1');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!autoplayPaused) nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [autoplayPaused]);

    if (loading) {
        return (
            <section className="carousel">
                <div className="carousel-loading">Carregando banners...</div>
            </section>
        );
    }

    return (
        <section className="carousel">
            <Splide
                ref={splideRef}
                options={{
                    type: 'loop',
                    perPage: 1,
                    speed: 1000,
                    gap: 15,
                    arrows: true,
                    pagination: true,
                }}
                onMouseEnter={() => setAutoplayPaused(true)}
                onMouseLeave={() => setAutoplayPaused(false)}
            >
                {slides.map((slide, index) => (
                    <SplideSlide key={index}>
                        <Link to={slide.link}>
                            <ResponsiveImage
                                desktop={slide.desktop}
                                mobile={slide.mobile}
                                alt={`Banner ${slide.productName}`}
                            />
                        </Link>
                    </SplideSlide>
                ))}
            </Splide>
        </section>
    );
}

ResponsiveImage.propTypes = {
    desktop: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    alt: PropTypes.string,
};
