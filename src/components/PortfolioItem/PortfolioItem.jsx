import style from './PortfolioItem.module.scss'

export default function PortfolioItem({img, title, children, link}) {
    return (
        <div className={`${style.portfolio__item}`}>
            <div data-aos="zoom-in-right"
                 className={`${style.portfolio__img__wrapper}`}>
                <a href={link}
                   target={'_blank'}
                   className={`${style.portfolio__img__link}`}>
                    <img src={img} alt="Work"/>
                </a>
            </div>
            <div data-aos="zoom-in-left"
                 className={`${style.portfolio__text__wrapper}`}>
                <h3>
                    {title}
                </h3>
                <div className={`${style.portfolio__description}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}