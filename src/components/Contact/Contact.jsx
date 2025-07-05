import style from './Contact.module.scss'
export default function Contact({link, children, title}) {
    return (
        <a href={link}
           className={style.contact}
           title={title}
           aria-label={title}
           target={'_blank'}
           style={{maxWidth: '70px', width: '100%'}}>
            {children} {/*svg*/}
        </a>
    )
}