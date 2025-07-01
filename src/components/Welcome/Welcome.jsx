import style from './Welcome.module.scss';
import welcomeImg from '../../assets/img/573375.png'

export default function Welcome() {
    return (
        <div className={`${style.welcome} container`}>
            <div className={style.welcome__text}>
                <h1>
                    <span className={style.welcome__text__welcome}>
                        Welcome</span>, my name is <span className={style.welcome__text__name}>Khetag</span>.<br/>
                    Im am a Front end developer
                </h1>
            </div>
            <div className={style.welcome__image}>
                <img src={welcomeImg} alt="Image" width={800}/>
            </div>
        </div>
    )
}