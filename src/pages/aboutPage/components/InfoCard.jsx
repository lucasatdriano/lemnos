import PropTypes from 'prop-types';

export default function InfoCard({ title, text }) {
    return (
        <div className="item">
            <h3>{title}</h3>

            <p>{text}</p>
        </div>
    );
}

InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};
