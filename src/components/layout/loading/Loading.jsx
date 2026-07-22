import PropTypes from 'prop-types';
import './loading.scss';

export default function Loading({ height = '100vh' }) {
    return (
        <>
            <div className="loadingIndicator" style={{ height }}>
                <h2 className="textLoading">Carregando...</h2>
                <div className="dot-spinner">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                </div>
            </div>
        </>
    );
}

Loading.propTypes = {
    height: PropTypes.string,
};
