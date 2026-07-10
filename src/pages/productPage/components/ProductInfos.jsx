import React from 'react';
import PropTypes from 'prop-types';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import iconAddCart from '../../../assets/icons/iconAddCart.svg';
import { formatCurrency } from '../../../utils/formatters';
import { BiCheck } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export default function ProductInfos({
    id,
    product,
    productRating,
    handleProductRating,
    isFavorite,
    isInCart,
    handleAddToFavorites,
    handleRemoveToFavorites,
    handleAddToCart,
    hasDiscount,
}) {
    const navigate = useNavigate();

    return (
        <div className="containerInfos">
            <div className="sectionIcons">
                <div className="rating">
                    <p className="productNote">
                        ({Math.ceil(product.avaliacao)})
                    </p>

                    {[1, 2, 3, 4, 5].reverse().map((index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`star-${index}`}
                                name={`star-rating-${id}`}
                                value={index}
                                checked={index === Math.ceil(productRating)}
                                onChange={() => handleProductRating(index)}
                            />

                            <label htmlFor={`star-${index}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={
                                        index <= Math.ceil(productRating)
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

                {isFavorite ? (
                    <MdFavorite
                        className="iconFav"
                        onClick={handleRemoveToFavorites}
                    />
                ) : (
                    <MdFavoriteBorder
                        className="iconFav"
                        onClick={handleAddToFavorites}
                    />
                )}
            </div>

            <h3 className="productName">{product.nome}</h3>

            {hasDiscount && (
                <p className="priceOrigin">
                    De <span>{formatCurrency(product.valorTotal)}</span> por:
                </p>
            )}

            <p className="productPrice">
                À vista <br />
                <span>{formatCurrency(product.valorComDesconto)}</span>
                <br />E no PIX com 15% de desconto
            </p>

            <p className="priceFees">
                Ou no Cartão <br />
                Em até 12x de{' '}
                <span>{formatCurrency(product.valorComDesconto / 12)}</span> sem
                juros
            </p>

            <button
                type="button"
                className={`btnAdd ${isInCart ? 'added' : ''}`}
                onClick={
                    isInCart ? () => navigate('/cart') : () => handleAddToCart
                }
            >
                {isInCart ? (
                    <>
                        <BiCheck className="iconAdd" /> Ver Carrinho
                    </>
                ) : (
                    <>
                        <img
                            src={iconAddCart}
                            alt="icon de adicionar ao Carrinho"
                            className="iconAdd"
                        />
                        Adicionar ao Carrinho
                    </>
                )}
            </button>
        </div>
    );
}

ProductInfos.propTypes = {
    id: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    productRating: PropTypes.number.isRequired,
    handleProductRating: PropTypes.func.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    isInCart: PropTypes.bool.isRequired,
    handleAddToFavorites: PropTypes.func.isRequired,
    handleRemoveToFavorites: PropTypes.func.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    hasDiscount: PropTypes.bool.isRequired,
};
