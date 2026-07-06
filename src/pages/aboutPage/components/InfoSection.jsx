import PropTypes from 'prop-types';

export default function InfoSection({
    title,
    paragraphs,
    image,
    imageDark,
    imageLight,
    imageClass,
}) {
    console.log(imageDark);
    console.log(imageLight);

    return (
        <section className="aboutContent">
            <div className="title">
                <hr />
                <h2>{title}</h2>
                <hr />
            </div>

            <div className="content">
                <div className="textContainer">
                    {paragraphs.map((text, index) => (
                        <p className="text" key={index}>
                            {text}
                        </p>
                    ))}
                </div>

                {image && (
                    <img src={image} alt={title} className={imageClass} />
                )}

                {imageDark && (
                    <img className="logoDark" src={imageDark} alt={title} />
                )}

                {imageLight && (
                    <img className="logoLight" src={imageLight} alt={title} />
                )}
            </div>
        </section>
    );
}

InfoSection.propTypes = {
    title: PropTypes.string.isRequired,
    paragraphs: PropTypes.array.isRequired,
    image: PropTypes.string,
    imageDark: PropTypes.string,
    imageLight: PropTypes.string,
    imageClass: PropTypes.string,
};
