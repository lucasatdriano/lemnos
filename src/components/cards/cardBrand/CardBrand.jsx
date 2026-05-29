import PropTypes from 'prop-types';
import './cardBrand.scss';

export default function CardBrands({ brand }) {
    return (
        <div className="brandCard">
            <img src={brand.image} alt={brand.name} className="brandImage" />
            <h3 className="brandName">{brand.name}</h3>
        </div>
    );
}

CardBrands.propTypes = {
    brand: PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};
