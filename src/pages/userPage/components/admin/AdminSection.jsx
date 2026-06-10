import PropTypes from 'prop-types';

export default function AdminSection({
    title,
    description,
    addLabel,
    listLabel,
    onAdd,
    onList,
}) {
    return (
        <div className="adminSection">
            <div className="sectionHeader">
                <h3>{title}</h3>

                <p className="helperText">{description}</p>

                <button type="button" className="addButton" onClick={onAdd}>
                    {addLabel}
                </button>

                <button type="button" className="listButton" onClick={onList}>
                    {listLabel}
                </button>
            </div>
        </div>
    );
}

AdminSection.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    addLabel: PropTypes.string.isRequired,
    listLabel: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
    onList: PropTypes.func.isRequired,
};
