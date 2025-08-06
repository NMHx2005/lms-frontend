interface CardSmallProps {
    category: string;
    title: string;
    desc: string;
    imgSrc: string;
    imgAlt: string;
    linkText: string;
    linkHref: string;
}
const CardSmall = ({ category, title, desc, imgSrc, imgAlt, linkText, linkHref }: CardSmallProps) => {
    return (
        <article className="card-small" role="listitem">
            <img src={imgSrc} alt={imgAlt} className="card-small__image" width="160" height="100" />
            <div className="card-small__content">
                <div className="card-small__category">{category}</div>
                <h3 className="card-small__title">{title}</h3>
                <p className="card-small__desc">{desc}</p>
                <a href={linkHref || "#"} className="card-small__link" aria-label={`Read more about ${title}`}>
                    {linkText}
                </a>
            </div>
        </article>
    );
};

export default CardSmall;