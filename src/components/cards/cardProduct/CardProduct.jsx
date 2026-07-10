import PropTypes from 'prop-types';
import './cardProduct.scss';
import './cardProductOffer.scss';
import { Link, useNavigate } from 'react-router-dom';
import iconAddCart from '../../../assets/icons/iconAddCart.svg';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import AuthService from '../../../services/AuthService';
import {
    adicionarFavorito,
    desfavoritarProduto,
    adicionarProdutoCarrinho,
} from '../../../services/UsuarioProdutoService';
import { useAuth } from '../../../hooks/useAuth';
import {
    addFavorite,
    removeFavorite,
} from '../../../store/slices/favoriteSlice';
import { formatCurrency } from '../../../utils/formatters';
import { addCarrinho } from '../../../store/slices/cartSlice';
import { BiCheck } from 'react-icons/bi';

export default function CardProduct({ produto }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);

    const isInCart = cartItems.some((item) => item.id === produto.id);

    const favorites = useSelector((state) => state.favorite.items);

    const isFavorite = favorites.some((favorite) => favorite.id === produto.id);

    async function handleAddToCart() {
        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/auth');

            return;
        }

        try {
            await adicionarProdutoCarrinho(produto, 1);

            dispatch(
                addCarrinho({
                    ...produto,
                    preco:
                        produto.desconto > 0
                            ? produto.valorComDesconto
                            : produto.valorTotal,
                    quantidade: 1,
                })
            );

            toast.success('Produto adicionado ao carrinho!');
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            toast.error('Erro ao adicionar produto ao carrinho.');
        }
    }

    const handleAddToFavorites = async (produto, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/auth');

            return;
        }

        if (AuthService.isClienteRole()) {
            try {
                await adicionarFavorito(produto);

                dispatch(addFavorite(produto));

                toast.success('Produto adicionado aos favoritos!');
            } catch (error) {
                console.error('Erro ao adicionar produto aos favoritos.');
            }
        } else {
            toast.warning(
                'Você precisa ser um cliente para adicionar produtos aos favoritos.'
            );
        }
    };

    const handleRemoveFavorite = async (produto, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/auth');

            return;
        }

        if (AuthService.isClienteRole()) {
            try {
                const success = await desfavoritarProduto(produto);

                if (success) {
                    dispatch(removeFavorite(produto.id));

                    toast.success('Produto removido dos favoritos!');
                }
            } catch (error) {
                toast.error('Erro ao remover produto dos favoritos.');
            }
        } else {
            toast.warning(
                'Você precisa ser um cliente para adicionar produtos aos favoritos.'
            );
        }
    };

    const hasDiscount = produto.desconto > 0;

    return (
        <>
            <div className="descont">
                <div className="productCard">
                    <Link to={`/product/${produto.id}`} className="productLink">
                        {hasDiscount && (
                            <p className="offerDescont">{produto.desconto}%</p>
                        )}
                        {isFavorite ? (
                            <MdFavorite
                                className="iconFav"
                                onClick={(e) =>
                                    handleRemoveFavorite(produto, e)
                                }
                            />
                        ) : (
                            <MdFavoriteBorder
                                className="iconFav"
                                onClick={(e) =>
                                    handleAddToFavorites(produto, e)
                                }
                            />
                        )}
                        <img
                            src={produto.imagemPrincipal}
                            alt={produto.nome}
                            className={'productImage'}
                        />
                        <div className="productDetails">
                            <p className="productName">{produto.nome}</p>
                            <>
                                {hasDiscount && (
                                    <p className="offerPrice">
                                        {formatCurrency(produto.valorTotal)}
                                    </p>
                                )}
                                <p className="productPrice">
                                    À vista <br />
                                    <span>
                                        {hasDiscount
                                            ? formatCurrency(
                                                  produto.valorComDesconto
                                              )
                                            : formatCurrency(
                                                  produto.valorTotal
                                              )}
                                    </span>
                                    <br />
                                    no PIX com 15% de desconto
                                </p>
                            </>
                        </div>
                    </Link>
                    <button
                        type="button"
                        className={`btnAdd ${isInCart ? 'added' : ''}`}
                        onClick={
                            isInCart ? () => navigate('/cart') : handleAddToCart
                        }
                    >
                        {isInCart ? (
                            <>
                                <BiCheck className="iconAdd" />
                                Ver Carrinho
                            </>
                        ) : (
                            <>
                                <img
                                    src={iconAddCart}
                                    alt="icone adicionar carrinho"
                                    className="iconAdd"
                                />
                                Adicionar ao Carrinho
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

CardProduct.propTypes = {
    produto: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        desconto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        imagemPrincipal: PropTypes.string,
        nome: PropTypes.string,
        valorTotal: PropTypes.number,
        valorComDesconto: PropTypes.number,
    }).isRequired,
};
