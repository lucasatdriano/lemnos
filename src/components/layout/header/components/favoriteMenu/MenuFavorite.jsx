import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { MdFavorite } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProdutoById } from '../../../../../services/ProdutoService';
import {
    listarProdutosFavoritos,
    adicionarProdutoCarrinho,
    desfavoritarProduto,
} from '../../../../../services/UsuarioProdutoService';
import iconAddCart from '../../../../../assets/icons/iconAddCart.svg';
import Loading from '../../../loading/Loading';
import AuthService from '../../../../../services/AuthService';
import { formatPreco } from '../../../../../utils/formatters';
import './menuFavorite.scss';

export default function MenuFavorite({ onClose, isOpen }) {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        setIsLoading(true);
        fetchFavorites();
    }, [isOpen]);

    const fetchFavorites = async () => {
        if (!AuthService.isLoggedIn() || !AuthService.isClienteRole()) {
            setFavorites([]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await listarProdutosFavoritos();
            const favoritoDetalhado = await Promise.all(
                response.map(async (produto) => {
                    const detalhesProduto = await getProdutoById(produto.id);
                    return { ...produto, ...detalhesProduto };
                })
            );

            if (!response) {
                navigate('/auth');
            }
            setFavorites(
                Array.isArray(favoritoDetalhado) ? favoritoDetalhado : []
            );
        } catch (error) {
            console.error('Erro ao listar produtos favoritos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFavorite = async (produto, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const success = await desfavoritarProduto(produto);
            if (success) {
                fetchFavorites();
            }
        } catch (error) {
            toast.error('Erro ao remover produto dos favoritos.');
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    const handleAddToCart = async (favorite) => {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarProdutoCarrinho(favorite, 1);
                toast.success('Produto adicionado ao carrinho!');
            } catch (error) {
                toast.error('Erro ao adicionar produto ao carrinho.');
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/auth');
        }
    };

    return (
        <div
            onClick={handleCloseModal}
            className={`modalFav ${isOpen ? 'active' : ''}`}
        >
            <div
                className={`menuFavorite ${isOpen ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <IoClose className="iconClose" onClick={handleCloseModal} />
                <div className="title">
                    <hr />
                    <h2>Meus Favoritos</h2>
                    <hr />
                </div>
                {isLoading ? (
                    <Loading />
                ) : favorites.length === 0 ? (
                    <div className="emptyFavMessage">
                        <h2 className="textEmpty">
                            Você não tem nenhum item adicionado aos Favoritos.
                        </h2>
                        <button
                            className="btnBack"
                            onClick={() => {
                                navigate('/productFilter');
                                handleCloseModal();
                            }}
                        >
                            Adicione itens aos Favoritos
                        </button>
                    </div>
                ) : (
                    <ul className="listaFavoritos">
                        {favorites.map((favorite) => {
                            const hasDiscount = favorite.desconto > 0;
                            return (
                                <li key={favorite.id} className="itemFav">
                                    <Link
                                        to={`/product/${favorite.id}`}
                                        className="favLink"
                                        onClick={handleCloseModal}
                                    >
                                        {hasDiscount && (
                                            <p className="offerDescont">
                                                {favorite.desconto}%
                                            </p>
                                        )}
                                        <img
                                            src={favorite.imagemPrincipal}
                                            alt={favorite.nome}
                                            className="productImage"
                                        />
                                        <div className="containerInfosFav">
                                            <MdFavorite
                                                className="iconFav"
                                                onClick={(e) =>
                                                    handleRemoveFavorite(
                                                        favorite,
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="productDetails">
                                            <h2 className="productName">
                                                {favorite.nome}
                                            </h2>
                                            <div className="pricingContainer">
                                                {hasDiscount && (
                                                    <p className="offerPrice">
                                                        {formatPreco(
                                                            favorite.valorTotal
                                                        )}
                                                    </p>
                                                )}
                                                <p className="productPrice">
                                                    À vista <br />
                                                    <span>
                                                        {formatPreco(
                                                            favorite.valorComDesconto
                                                        )}
                                                    </span>{' '}
                                                    <br />
                                                    no PIX com 15% de desconto
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        type="button"
                                        className="btnAdd"
                                        onClick={() =>
                                            handleAddToCart(favorite)
                                        }
                                    >
                                        <img
                                            src={iconAddCart}
                                            alt="icon add Cart"
                                            className="iconAdd"
                                        />
                                        Adicionar ao Carrinho
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

MenuFavorite.propTypes = {
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};
