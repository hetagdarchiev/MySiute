import html from '../../assets/ico/html.svg'
import css from '../../assets/ico/css.svg'
import js from '../../assets/ico/js.svg'
import scss from '../../assets/ico/scss.svg'
import bootstrap from '../../assets/ico/bootstrap.svg'
import style from './Skills.module.scss'
import php from '../../assets/ico/php.svg'
import sql from '../../assets/ico/sql.svg'
import git from '../../assets/ico/git.svg'
import figma from '../../assets/ico/figma.svg'
import react from '../../assets/ico/react.svg'
import vite from '../../assets/ico/vite.svg'
import npm from '../../assets/ico/npm.svg'
import photoshop from '../../assets/ico/photoshop.svg'
import sharp from '../../assets/ico/cSharp.svg'
import other from '../../assets/ico/other.svg'

import Skill from '../Skill/Skill.jsx'
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from "react";

export default function Skills() {
    useEffect(() => {
        AOS.init({duration: 500});
    }, []);

    return (
        <section id="skills" className={`${style.skills} container`}>
            <h2 className={'skills__title'}>
                My Skills
            </h2>
            <div className={style.skills__wrapper}>
                <h3 data-aos={'fade-up'}>Front end</h3>
                <Skill data={'fade-right'} img={html} title={'My Html skills'}>
                    <li>
                        Responsive layout is the ability to create websites that display correctly on all devices
                    </li>
                    <li>
                        Semantics – using the right tags ({'<header>, <section>, <article>, <nav>'} and others) to
                        improve SEO and accessibility.
                    </li>
                    <li>
                        Structuring content with SEO optimization in mind
                    </li>
                    <li>
                        Using forms and client-side validation
                    </li>
                </Skill>
                <Skill data={'fade-left'} img={css} title={'My Css skills'}>
                    <li>
                        Basic syntax includes selectors, properties, cascading, and inheritance.
                    </li>
                    <li>
                        Flexbox & Grid are modern layout techniques for complex designs.
                    </li>
                    <li>
                        Animations and transformations (transition, transform, @keyframes).
                    </li>
                    <li>
                        Pseudo-classes and pseudo-elements (:hover, :focus, ::before, ::after).
                    </li>
                </Skill>
                <Skill data={'fade-right'} img={scss} title={'My Scss skills'}>
                    <li>
                        Arithmetic operations.
                    </li>
                    <li>
                        Mixins
                    </li>
                    <li>
                        Enclosure
                    </li>
                </Skill>
                <Skill data={'fade-right'} img={bootstrap} title={'My Bootstrap skills'}>
                    <li>
                        Adaptive grid (columns, breakpoints).
                    </li>
                    <li>
                        Ready-made components include buttons, cards, navigation, and modal windows.
                    </li>
                    <li>
                        Utilities include padding, colors, and flex classes.
                    </li>
                </Skill>
                <Skill data={'fade-left'} img={js} title={'My JavaScript skills'}>
                    <li>
                        The basics include variables, functions, conditions, loops, objects, and arrays.
                    </li>
                    <li>
                        DOM manipulation – working with page elements
                    </li>
                    <li>
                        Asynchrony – Promise, async/await, fetch (working with APIs).
                    </li>
                    <li>
                        ES6+ – arrow functions, destructuring, template strings, and modules.
                    </li>
                </Skill>
                <Skill data={'fade-left'} img={react} title={'My React skills'}>
                    <li>
                        Basics: components, props, and state.
                    </li>
                </Skill>
                <Skill data={'fade-right'} img={other} title={'My Other skills'}>
                    <li title={'Vite'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                        <img src={vite} width={40} alt=""/>
                        <span>
                            Vite
                        </span>
                    </li>
                    <li title={'npm'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                        <img src={npm} width={40} alt=""/>
                        <span>
                            package Manager
                        </span>
                    </li>
                </Skill>
            </div>
            <div className={style.skills__wrapper}>
                <h3 data-aos={'fade-up'}>Back end</h3>
                <Skill data={'fade-left'} img={php} title={'My Php skills'}>
                    <li>
                        Syntax: variables, conditions, loops, and functions.
                    </li>
                    <li>
                        Работа с формами – $_GET, $_POST, валидация.
                    </li>
                    <li>
                        Sessions and cookies – user authentication.
                    </li>
                    <li>
                        Working with files – reading/writing, uploading files.
                    </li>
                    <li>
                        PDO / MySQLi – secure interaction with the database.
                    </li>
                </Skill>
                <Skill data={'fade-right'} img={sql} title={'My Sql skills'}>
                    <li>Requests – SELECT, INSERT, UPDATE, DELETE.</li>
                    <li>Table relationships – JOIN, foreign keys.</li>
                </Skill>
            </div>
            <div className={style.skills__wrapper}>
                <h3 data-aos={'fade-up'}>Other</h3>
                <Skill data={'fade-left'} img={git} title={'My Git skills'}>
                    <li>The main commands are git init, add, commit, push, pull, and merge.</li>
                    <li>Branching – branch, checkout, rebase.</li>
                    <li>GitHub Pages is a static website hosting service.</li>
                </Skill>
                <Skill data={'fade-right'} img={figma} title={'My Figma skills'}>
                    <li>Export resources – icons, images, and SVGs.</li>
                    <li>Working with layouts and design systems.</li>
                </Skill>
                <Skill data={'fade-left'} img={photoshop} title={'My Photoshop skills'}>
                    <li>
                        Image processing (Cropping, Resizing, Color correction)
                    </li>
                    <li>
                        Text and vector graphics
                    </li>
                    <li>
                        Website layout preparation
                    </li>
                    <li>
                        UI elements creation (Buttons, icons, product cards.)
                    </li>
                    <li>
                        Shadows, gradients, and blending effects
                    </li>
                </Skill>
                <Skill data={'fade-right'} img={sharp} title={'My C# skills'}>
                    <li>
                        Syntax: variables, operators, conditions, and loops
                    </li>
                    <li>
                        Data types: int, string, bool, DateTime, arrays, and lists {'List < T >'}.
                    </li>
                    <li>
                        Functions and methods: parameters, return values, ref/out.
                    </li>
                    <li>
                        OOP: classes, objects, inheritance, polymorphism, and interfaces.
                    </li>
                    <li>
                        Working with files and streams
                        File, StreamReader, StreamWriter, System.IO.
                    </li>
                </Skill>
            </div>
        </section>
    )
}