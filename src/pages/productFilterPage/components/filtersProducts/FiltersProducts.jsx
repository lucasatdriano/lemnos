import React from 'react';
import PropTypes from 'prop-types';

import { IoList } from 'react-icons/io5';
import { HiSquares2X2 } from 'react-icons/hi2';

import {
    FILTER_BRANDS,
    FILTER_CATEGORIES,
    FILTER_SUBCATEGORIES,
} from '../../../../constants/filters';

import DoubleInputRange from '../../../../components/inputs/doubleInput/DoubleInput';

import './filtersProducts.scss';

export default function FiltersProducts({
    cardList,
    handleAlterCardsView,
    filters,
    handleCategoryChange,
    setFilters,
    calculatedMaxPrice,
    handleProductRating,
}) {
    return (
        <section className="productFilterContainer">
            <div className="containerAlterFilter">
                <p className="containerChecked">
                    <input
                        type="radio"
                        id="listView"
                        name="view"
                        checked={cardList}
                        onChange={() => handleAlterCardsView(true)}
                    />

                    <label htmlFor="listView" className="labelIcon">
                        <IoList className="iconAlter" />
                    </label>
                </p>

                <p className="containerChecked">
                    <input
                        type="radio"
                        id="gridView"
                        name="view"
                        checked={!cardList}
                        onChange={() => handleAlterCardsView(false)}
                    />

                    <label htmlFor="gridView" className="labelIcon">
                        <HiSquares2X2 className="iconAlter" />
                    </label>
                </p>
            </div>

            <select value={filters.category} onChange={handleCategoryChange}>
                <option value="">Todas as Categorias</option>

                {FILTER_CATEGORIES.map((categoria) => (
                    <option key={categoria} value={categoria}>
                        {categoria}
                    </option>
                ))}
            </select>

            <select
                value={filters.subCategory}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        subCategory: e.target.value,
                    }))
                }
            >
                <option value="">Todas as SubCategorias</option>

                {FILTER_SUBCATEGORIES[filters.category]?.map((subcategoria) => (
                    <option key={subcategoria} value={subcategoria}>
                        {subcategoria}
                    </option>
                ))}
            </select>

            <select
                value={filters.brand}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        brand: e.target.value,
                    }))
                }
            >
                <option value="">Todas as Marcas</option>

                {FILTER_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                        {brand}
                    </option>
                ))}
            </select>

            <DoubleInputRange
                key={filters.maxPrice}
                minValue={filters.minPrice}
                maxValue={filters.maxPrice}
                setMinValue={(minPrice) =>
                    setFilters((prev) => ({
                        ...prev,
                        minPrice,
                    }))
                }
                setMaxValue={(maxPrice) =>
                    setFilters((prev) => ({
                        ...prev,
                        maxPrice,
                    }))
                }
                maxPrice={calculatedMaxPrice}
            />

            <div className="ratingFilter">
                {[5, 4, 3, 2, 1].map((index) => (
                    <React.Fragment key={index}>
                        <input
                            type="radio"
                            id={`star-${index}`}
                            name="star-rating"
                            value={index}
                            checked={index === filters.evaluation}
                            onChange={() => handleProductRating(index)}
                        />

                        <label htmlFor={`star-${index}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className={
                                    index <= filters.evaluation ? 'filled' : ''
                                }
                            >
                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}

FiltersProducts.propTypes = {
    cardList: PropTypes.bool.isRequired,
    handleAlterCardsView: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    handleCategoryChange: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    calculatedMaxPrice: PropTypes.number.isRequired,
    handleProductRating: PropTypes.func.isRequired,
};
