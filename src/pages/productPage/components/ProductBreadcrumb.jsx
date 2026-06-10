import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ProductBreadcrumb({ product }) {
    return (
        <div className="breadcrumb">
            <Link to="/" className="breadcrumbLink">
                Home
            </Link>

            <span className="separator">/</span>

            <Link
                to={`/productFilter/${product.categoria}`}
                className="breadcrumbLink"
            >
                {product.categoria}
            </Link>

            <span className="separator">/</span>

            <Link
                to={`/productFilter/${product.subCategoria}`}
                className="breadcrumbLink"
            >
                {product.subCategoria}
            </Link>

            <span className="separator">/</span>

            <Link
                to={`/productFilter/${product.fabricante}`}
                className="breadcrumbLink"
            >
                {product.fabricante}
            </Link>

            <span className="separator">/</span>

            <span className="breadcrumbCurrent">{product.nome}</span>
        </div>
    );
}

ProductBreadcrumb.propTypes = {
    product: PropTypes.object.isRequired,
};
