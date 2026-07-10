import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ProductBreadcrumb({ product }) {
    const clearFilters = () => {
        localStorage.removeItem('searchTerm');
        localStorage.removeItem('brand');
        localStorage.removeItem('category');
        localStorage.removeItem('subCategory');
        localStorage.removeItem('evaluation');
        localStorage.removeItem('minPrice');
        localStorage.removeItem('maxPrice');
    };

    const handleCategoryClick = () => {
        clearFilters();
        localStorage.setItem('category', product.categoria);
    };

    const handleSubCategoryClick = () => {
        clearFilters();
        localStorage.setItem('category', product.categoria);
        localStorage.setItem('subCategory', product.subCategoria);
    };

    return (
        <div className="breadcrumb">
            <Link to="/" className="breadcrumbLink">
                Home
            </Link>

            <span className="separator">/</span>

            <Link
                to={`/productFilter/${product.categoria}`}
                className="breadcrumbLink"
                onClick={handleCategoryClick}
            >
                {product.categoria}
            </Link>

            <span className="separator">/</span>

            <Link
                to={`/productFilter/${product.subCategoria}`}
                className="breadcrumbLink"
                onClick={handleSubCategoryClick}
            >
                {product.subCategoria}
            </Link>

            <span className="separator">/</span>

            <span className="breadcrumbCurrent">{product.nome}</span>
        </div>
    );
}

ProductBreadcrumb.propTypes = {
    product: PropTypes.object.isRequired,
};
