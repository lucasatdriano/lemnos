import PropTypes from 'prop-types';

export default function ProductImages({
    product,
    mainImage,
    handleImageClick,
    hasDiscount,
}) {
    return (
        <div className="containerImages">
            <div className="optionsImages">
                <img
                    src={product.imagemPrincipal}
                    alt={product.nome}
                    className={`optionImage ${
                        mainImage === product.imagemPrincipal ? 'selected' : ''
                    }`}
                    onClick={() => handleImageClick(product.imagemPrincipal)}
                />

                {product.imagens?.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`img${index}`}
                        className={`optionImage ${
                            mainImage === image ? 'selected' : ''
                        }`}
                        onClick={() => handleImageClick(image)}
                    />
                ))}
            </div>

            <img src={mainImage} alt={product.nome} className="imageMain" />

            {hasDiscount && <p className="offerDescont">{product.desconto}%</p>}
        </div>
    );
}

ProductImages.propTypes = {
    product: PropTypes.object.isRequired,
    mainImage: PropTypes.string.isRequired,
    handleImageClick: PropTypes.func.isRequired,
    hasDiscount: PropTypes.bool.isRequired,
};
