/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import { getProdutoById } from '../../services/ProdutoService';
import {
    adicionarFavorito,
    adicionarProdutoCarrinho,
    avaliarProduto,
    desfavoritarProduto,
    listarProdutosFavoritos,
} from '../../services/UsuarioProdutoService';
import Loading from '../../components/layout/loading/Loading';
import OfferList from '../../components/layout/lists/OfferList';
import ProductInfos from './components/ProductInfos';
import ProductImages from './components/ProductImages';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductDetails from './components/ProductDetails';
import './product.scss';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [productRating, setProductRating] = useState(0);

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (product) {
            setInfo();
        }
    }, [product]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getProdutoById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/Error404');
        } finally {
            setLoading(false);
        }
    };

    const setInfo = async () => {
        setLoading(true);
        try {
            setMainImage(product.imagemPrincipal);
            setProductRating(Math.ceil(product.avaliacao));
            if (
                AuthService.isLoggedIn() &&
                AuthService.getRole() == 'CLIENTE'
            ) {
                const favorites = await listarProdutosFavoritos();
                const isFavorited = favorites.some(
                    (fav) => fav.id === product.id
                );

                if (!favorites) {
                    navigate('/auth');
                }
                setIsFavorite(isFavorited);
            }
        } catch (error) {
            toast.error('Erro ao setar as informações do produto');
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleAddToCart = async () => {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarProdutoCarrinho(product, 1);
                toast.success('Produto adicionado ao carrinho!');
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/auth');
        }
    };

    const handleAddToFavorites = async () => {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarFavorito(product);
                toast.success('Produto adicionado aos favoritos!');
                setIsFavorite(true);
            } catch (error) {
                console.error(
                    'Erro ao adicionar produto aos favoritos:',
                    error
                );
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/auth');
        }
    };

    const handleRemoveToFavorites = async () => {
        if (AuthService.isLoggedIn() && AuthService.isClienteRole()) {
            try {
                await desfavoritarProduto(product);
                toast.success('Produto removido dos favoritos');
                setIsFavorite(false);
            } catch (error) {
                console.error('Erro ao remover produto dos favoritos:', error);
            }
        } else {
            toast.warning(
                'Você precisa estar logado para remover produtos dos favoritos.'
            );
            navigate('/auth');
        }
    };

    const handleProductRating = async (rating) => {
        if (AuthService.isLoggedIn()) {
            try {
                await avaliarProduto(product, rating);
                toast.success('Produto avaliado!');
                setProductRating(rating);
            } catch (error) {
                console.error('Erro ao avaliar o produto:', error);
                toast.error('Erro ao avaliar o produto');
            }
        } else {
            toast.warning('Você precisa estar logado para avaliar produtos.');
            navigate('/auth');
        }
    };

    const hasDiscount = product && product.desconto > 0;

    return (
        <main className="productContainer">
            <hr />
            {loading ? (
                <div className="loadingProduct">
                    <Loading />
                </div>
            ) : (
                <section className="containerProductMain">
                    <ProductBreadcrumb product={product} />

                    <section className="productMain">
                        <ProductImages
                            product={product}
                            mainImage={mainImage}
                            handleImageClick={handleImageClick}
                            hasDiscount={hasDiscount}
                        />

                        <ProductInfos
                            id={id}
                            product={product}
                            productRating={productRating}
                            handleProductRating={handleProductRating}
                            isFavorite={isFavorite}
                            handleAddToFavorites={handleAddToFavorites}
                            handleRemoveToFavorites={handleRemoveToFavorites}
                            handleAddToCart={handleAddToCart}
                            hasDiscount={hasDiscount}
                        />
                    </section>

                    <ProductDetails product={product} />
                </section>
            )}
            <section className="offers">
                <h2>Produtos Similares</h2>
                <OfferList
                    categoria={product.categoria}
                    subCategoria={product.subCategoria}
                    limit={10}
                />
            </section>
        </main>
    );
}
