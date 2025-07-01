import style from './Welcome.module.scss';
import welcomeImg from '../../assets/img/573375.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from "react";

export default function Welcome() {
    useEffect(() => {
        AOS.init({duration: 1000});
    }, []);
    return (
        <section className={`${style.welcome} container`}>
            <div className={style.welcome__text}>
                <h1 data-aos='fade-down'>
                    <span className={style.welcome__text__welcome}>
                        Welcome</span>, my name is <span className={style.welcome__text__name}>Khetag</span>.<br/>
                    Im am a Front end developer
                </h1>
            </div>
            <div className={style.welcome__image__wrapper} data-aos='fade-up'>
                <img src={welcomeImg} className={style.welcome__image} alt="Image" width={800}/>
            </div>
        </section>
    )
}