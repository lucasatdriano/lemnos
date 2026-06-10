/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { toast, ToastContainer } from 'react-toastify';
import './doubleInput.scss';
import { formatPreco } from '../../../utils/formatters';

const STEP = 50;
const MIN = 0;

export default function DoubleInputRange({
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    maxPrice,
}) {
    const [values, setValues] = useState([minValue, maxValue]);

    useEffect(() => {
        setValues([minValue, maxValue]);
    }, [minValue, maxValue]);

    const parseCurrencyToNumber = (value) => {
        const numeric = value.replace(/\D/g, '');
        return numeric ? parseInt(numeric, 10) : NaN;
    };

    const handleRangeChange = (newValues) => {
        setValues(newValues);
    };

    const handleRangeFinalChange = (newValues) => {
        const [newMin, newMax] = newValues;
        setMinValue(newMin);
        setMaxValue(newMax);
    };

    const handleMinInputChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = parseCurrencyToNumber(rawValue);

        if (!isNaN(numericValue) && numericValue <= maxPrice) {
            setValues([numericValue, values[1]]);
            setMinValue(numericValue);
        } else if (rawValue === '') {
            setValues([0, values[1]]);
            setMinValue(0);
        }
    };

    const handleMinInputBlur = () => {
        let [minVal, maxVal] = values;

        if (isNaN(minVal) || minVal < MIN) {
            toast.warning('O valor mínimo não pode ser menor que 0.');
            minVal = MIN;
        } else if (minVal > maxVal) {
            toast.warning(
                'O valor mínimo não pode ser maior que o valor máximo.'
            );
            minVal = maxVal;
        }

        setMinValue(minVal);
        setValues([minVal, maxVal]);
    };

    const handleMaxInputChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = parseCurrencyToNumber(rawValue);

        if (!isNaN(numericValue) && numericValue <= maxPrice) {
            setValues([values[0], numericValue]);
            setMaxValue(numericValue);
        } else if (rawValue === '') {
            setValues([values[0], maxPrice]);
            setMaxValue(maxPrice);
        }
    };

    const handleMaxInputBlur = () => {
        let [minVal, maxVal] = values;

        if (isNaN(maxVal) || maxVal > maxPrice) {
            toast.warning(
                `O valor máximo não pode ser maior que ${formatPreco(maxPrice)}.`
            );
            maxVal = maxPrice;
        } else if (maxVal < minVal) {
            toast.warning(
                'O valor máximo não pode ser menor que o valor mínimo.'
            );
            maxVal = minVal;
        }

        setMaxValue(maxVal);
        setValues([minVal, maxVal]);
    };

    return (
        <div className="doubleRangeInput">
            <ToastContainer />
            <div className="rangeSlider">
                <Range
                    values={values}
                    step={STEP}
                    min={MIN}
                    max={maxPrice}
                    onChange={handleRangeChange}
                    onFinalChange={handleRangeFinalChange}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                borderRadius: '5px',
                                height: '6px',
                                width: '100%',
                                background: getTrackBackground({
                                    values,
                                    colors: ['#415352', '#36CEC4', '#415352'],
                                    min: MIN,
                                    max: maxPrice,
                                }),
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '25px',
                                width: '25px',
                                borderRadius: '50%',
                                backgroundColor: '#50817e',
                                border: '1px solid #50817e',
                            }}
                        />
                    )}
                />
                <div className="inputBox">
                    <div className="minBox">
                        <div className="inputWrap">
                            <input
                                type="text"
                                className="inputField minInput"
                                value={formatPreco(values[0])}
                                onChange={handleMinInputChange}
                                onBlur={handleMinInputBlur}
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                    <div className="maxBox">
                        <p>ATÉ</p>
                        <div className="inputWrap">
                            <input
                                type="text"
                                className="inputField maxInput"
                                value={formatPreco(values[1])}
                                onChange={handleMaxInputChange}
                                onBlur={handleMaxInputBlur}
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
