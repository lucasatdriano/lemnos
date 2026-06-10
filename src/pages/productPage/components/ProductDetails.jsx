import PropTypes from 'prop-types';

export default function ProductDetails({ product }) {
    return (
        <section className="containerDetails">
            <div className="containerDescription">
                <h3>Descrição do Produto</h3>

                <p>{product.descricao}</p>
            </div>

            <div className="containerSpecifications">
                <p className="specification">
                    <strong>Nome:</strong>
                    {product.nome}
                </p>

                <p className="specification">
                    <strong>Marca:</strong>
                    {product.fabricante}
                </p>

                <p className="specification">
                    <strong>Categoria:</strong>
                    {product.categoria}
                </p>

                <p className="specification">
                    <strong>SubCategoria:</strong>
                    {product.subCategoria}
                </p>

                <p className="specification">
                    <strong>Comprimento:</strong>
                    {product.comprimento} cm
                </p>

                <p className="specification">
                    <strong>Altura:</strong>
                    {product.altura} cm
                </p>

                <p className="specification">
                    <strong>Largura:</strong>
                    {product.largura} cm
                </p>

                <p className="specification">
                    <strong>Peso:</strong>
                    {product.peso} kg
                </p>
            </div>
        </section>
    );
}

ProductDetails.propTypes = {
    product: PropTypes.object.isRequired,
};
