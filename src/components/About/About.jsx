import style from './About.module.scss';
import MyImg from '../../assets/img/meTwo.png';
import {useEffect, useState} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutMe() {
    const [year, setYear] = useState(0);
    useEffect(() => {
        AOS.init({duration: 2000});
        const currentYear = new Date().getFullYear() - 2003;
        setYear(currentYear);
    }, []);

    return (
        <section className={`container`} id="about">
            <h2> About me </h2>
            <div className={`${style.about}`}>
                <div className={style.about__img__wrapper} data-aos="fade-right">
                    <img src={MyImg} className={style.about__img} alt="My Picture" width={700}/>
                </div>
                <ul className={style.about__list}>
                    <li className={style.about__list__item}>
                        <div data-aos="fade-right" data-aos-duration="700" className={style.about__list__circle}></div>
                        <div data-aos="fade-left" data-aos-duration="700">Khetag Darchiev</div>
                    </li>
                    <li className={style.about__list__item}>
                        <div data-aos="fade-right" data-aos-duration="1000" className={style.about__list__circle}></div>
                        <div data-aos="fade-left" data-aos-duration="1000">I'm {year} years old.</div>
                    </li>
                    <li className={style.about__list__item}>
                        <div data-aos="fade-right" data-aos-duration="1300" className={style.about__list__circle}></div>
                        <div data-aos="fade-left" data-aos-duration="1300">I like to communicate with people.</div>
                    </li>
                    <li className={style.about__list__item}>
                        <div data-aos="fade-right" data-aos-duration="1600" className={style.about__list__circle}></div>
                        <div data-aos="fade-left" data-aos-duration="1600">I love learning and discovering new things.
                        </div>
                    </li>
                    <li className={style.about__list__item}>
                        <div data-aos="fade-right" data-aos-duration="1900" className={style.about__list__circle}></div>
                        <div data-aos="fade-left" data-aos-duration="1900">Very love listen music</div>
                    </li>
                </ul>
            </div>
        </section>
    )
}