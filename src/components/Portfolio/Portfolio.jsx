import Item from '../PortfolioItem/PortfolioItem.jsx'
import library from '../../assets/img/myLibrary.png'
import spaceDash from '../../assets/img/mySpaceDash.png'
import myGames from '../../assets/img/myGames.png'
import style from "./Portfolio.module.scss";
export default function Portfolio() {

    let gitHubLinkLibrex = 'https://github.com/hetagdarchiev/librex'
    let gitHubLinkGames = 'https://github.com/hetagdarchiev/games-js'
    let gitHubSpaceDash = 'https://github.com/hetagdarchiev/siute.git'
    return (
        <section id={'portfolio'} className={`${style.portfolio} container`}>
            <h2>Portfolio</h2>
            <div className="portfolio-wrapper">
                <Item img={library} title={"LibreX"} link={gitHubLinkLibrex}>
                    <ul>
                        <li>html</li>
                        <li>scss</li>
                        <li>js</li>
                        <li>php</li>
                        <li>sql</li>
                        <li>swiper</li>
                        <li>Date: 05.07.2025</li>
                    </ul>
                </Item>
                <Item img={spaceDash} title={"Space Dash"} link={gitHubSpaceDash}>
                    <ul>
                        <li>html</li>
                        <li>scss</li>
                        <li>js</li>
                        <li>Date: 04.2025</li>
                    </ul>
                </Item>
                <Item img={myGames} title={"MyGames"} link={gitHubLinkGames}>
                    <ul>
                        <li>html</li>
                        <li>scss</li>
                        <li>js</li>
                        <li>Date: 12.2024</li>
                    </ul>
                </Item>
            </div>
        </section>
    )
}