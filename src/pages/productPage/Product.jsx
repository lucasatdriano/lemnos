import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loadFavorites } from '../../store/thunks/favoriteThunk';
import AuthService from '../../services/AuthService';
import { getProdutoById } from '../../services/ProdutoService';
import {
    adicionarFavorito,
    desfavoritarProduto,
    adicionarProdutoCarrinho,
    avaliarProduto,
} from '../../services/UsuarioProdutoService';
import Loading from '../../components/layout/loading/Loading';
import OfferList from '../../components/layout/lists/OfferList';
import ProductInfos from './components/ProductInfos';
import ProductImages from './components/ProductImages';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductDetails from './components/ProductDetails';
import './product.scss';
import { useAuth } from '../../hooks/useAuth';
import { addFavorite, removeFavorite } from '../../store/slices/favoriteSlice';
import { addCarrinho } from '../../store/slices/cartSlice';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const [productRating, setProductRating] = useState(0);

    const dispatch = useDispatch();

    const favorites = useSelector((state) => state.favorite.items);
    const isFavorite = favorites.some((fav) => fav.id === product.id);

    const cartItems = useSelector((state) => state.cart.items);
    const isInCart = cartItems.some((item) => item.id === product.id);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getProdutoById(id);

            setProduct(data);
            setMainImage(data.imagemPrincipal);
            setProductRating(Math.ceil(data.avaliacao || 0));
        } catch (error) {
            console.error(error);
            navigate('/Error404');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchData();

        if (isAuthenticated && AuthService.isClienteRole()) {
            dispatch(loadFavorites());
        }
    }, [id, fetchData, isAuthenticated, dispatch]);

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/auth');

            return;
        }

        try {
            await adicionarProdutoCarrinho(product, 1);

            dispatch(
                addCarrinho({
                    ...product,
                    preco:
                        product.desconto > 0
                            ? product.valorComDesconto
                            : product.valorTotal,
                    quantidade: 1,
                })
            );

            toast.success('Produto adicionado ao carrinho!');
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            toast.error('Erro ao adicionar produto ao carrinho.');
        }
    };

    const handleAddToFavorites = async () => {
        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/auth');

            return;
        }

        if (AuthService.isClienteRole()) {
            try {
                await adicionarFavorito(product);

                dispatch(addFavorite(product));

                toast.success('Produto adicionado aos favoritos!');
            } catch (error) {
                console.error(
                    'Erro ao adicionar produto aos favoritos:',
                    error
                );
            }
        } else {
            toast.warning(
                'Você precisa ser um cliente para adicionar produtos aos favoritos.'
            );
        }
    };

    const handleRemoveToFavorites = async () => {
        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para remover produtos dos favoritos.'
            );
            navigate('/auth');

            return;
        }

        if (AuthService.isClienteRole()) {
            try {
                await desfavoritarProduto(product);

                dispatch(removeFavorite(product.id));

                toast.success('Produto removido dos favoritos');
            } catch (error) {
                console.error('Erro ao remover produto dos favoritos:', error);
            }
        } else {
            toast.warning(
                'Você precisa ser um cliente para remover produtos dos favoritos.'
            );
        }
    };

    const handleProductRating = async (rating) => {
        if (!isAuthenticated) {
            toast.warning('Você precisa estar logado para avaliar produtos.');
            navigate('/auth');

            return;
        }

        try {
            await avaliarProduto(product, rating);
            toast.success('Produto avaliado!');
            setProductRating(rating);
        } catch (error) {
            console.error('Erro ao avaliar o produto:', error);
            toast.error('Erro ao avaliar o produto');
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
                            isInCart={isInCart}
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
