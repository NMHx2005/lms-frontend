interface CardProps {
    category: string;
    title: string;
    desc: string;
    imgSrc: string;
    imgAlt: string;
    btnText: string;
    linkText: string;
    linkHref: string;
}

const Card = ({ category, title, desc, imgSrc, imgAlt, btnText, linkText, linkHref }: CardProps) => {
    return (
        <article className="card">
            <img src={imgSrc} alt={imgAlt || `Image for ${title}`} className="card__image" />
            <div className="card__content">
                <div className="card__category">{category}</div>
                <h3 className="card__title">{title}</h3>
                {desc?.trim() && <p className="card__desc">{desc}</p>}
            </div>
            <div className="card__footer">
                {btnText?.trim() && (
                    <button type="button" className="card__btn-sm btn">
                        {btnText}
                    </button>
                )}
                {linkText?.trim() && (
                    <a
                        href={linkHref ? linkHref : "#"}
                        className="card__link"
                        aria-label={`Read more about ${title}`}
                    >
                        {linkText}
                    </a>
                )}
            </div>
        </article>
    );
};

export default Card;