import style from './Links.module.scss'

export default function Link({children, href}) {

    return (
        <a href={href} className={style.link}>
            {children}
        </a>
    )
}
