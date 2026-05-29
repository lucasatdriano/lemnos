import logoHorizontal from '../../../assets/imgLemnos/logoHorizontalClaro.svg';
import Infos from './components/infos/Infos';
import ToolTip from '../../tooltip/ToolTip';
import {
    RiLinkedinFill,
    RiInstagramFill,
    RiTwitterFill,
    RiFacebookFill,
} from 'react-icons/ri';

export default function Footer() {
    return (
        <footer>
            <Infos />
            <section id="footerContent">
                <a href="#">
                    <img src={logoHorizontal} alt="logo"></img>
                </a>
                <nav className="navLinks">
                    <ul>
                        <h3>Institucional</h3>
                        <li>
                            <a href="#">Quem Somos</a>
                        </li>
                        <li>
                            <a href="#">Nossas Lojas</a>
                        </li>
                        <li>
                            <a href="#">Blog</a>
                        </li>
                    </ul>
                    <ul>
                        <h3>Ajuda</h3>
                        <li>
                            <a href="#">SAC</a>
                        </li>
                        <li>
                            <a href="#">Fale Conosco</a>
                        </li>
                        <li>
                            <a href="#">Termos de Aceite</a>
                        </li>
                        <li>
                            <a href="#">Politicas de Privacidade</a>
                        </li>
                    </ul>
                    <ul>
                        <h3>Dúvidas</h3>
                        <li>
                            <a href="#">Entrega</a>
                        </li>
                        <li>
                            <a href="#">Garantia</a>
                        </li>
                        <li>
                            <a href="#">Como Comprar</a>
                        </li>
                        <li>
                            <a href="#">Formas de Pagamento</a>
                        </li>
                        <li>
                            <a href="#">Sobre Boletos</a>
                        </li>
                    </ul>
                </nav>
                <div className="iconsNav">
                    <div className="icons">
                        <ToolTip message="Linkedin">
                            <a
                                href="https://www.linkedin.com/in/lemnos-company-b73885313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <RiLinkedinFill className="icon" />
                            </a>
                        </ToolTip>
                        <ToolTip message="Instagram">
                            <a
                                href="https://www.instagram.com/lemnos_co?igsh=MTZkc2F3eGJ5MW12Ng=="
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <RiInstagramFill className="icon" />
                            </a>
                        </ToolTip>
                        <ToolTip message="Twitter">
                            <a
                                href="https://x.com/lemnos_co"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <RiTwitterFill className="icon" />
                            </a>
                        </ToolTip>
                        <ToolTip message="Facebook">
                            <a
                                href="https://www.facebook.com/profile.php?id=61561120856036&mibextid=ZbWKwL"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <RiFacebookFill className="icon" />
                            </a>
                        </ToolTip>
                    </div>
                    <hr />
                </div>
            </section>
            <hr className="hrAuthorship" />
            <div className="authorship">
                <small>
                    © 2024 Lemnos - Todos os Direitos Reservados. - Por{' '}
                    <a
                        href="https://techverse-co.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TechVerse
                    </a>
                </small>
                <small>
                    <a href="#">Termos e Condições</a> |{' '}
                    <a href="#">Política de Privacidade</a>
                </small>
            </div>
        </footer>
    );
}
