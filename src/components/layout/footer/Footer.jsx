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
                <a href="#" aria-label="Página inicial Lemnos">
                    <img
                        src={logoHorizontal}
                        alt="Logo Lemnos - Página inicial"
                    />
                </a>

                <nav className="navLinks" aria-label="Navegação do rodapé">
                    <div>
                        <h3>Institucional</h3>
                        <ul>
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
                    </div>

                    <div>
                        <h3>Ajuda</h3>
                        <ul>
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
                    </div>

                    <div>
                        <h3>Dúvidas</h3>
                        <ul>
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
                    </div>
                </nav>

                <div className="iconsNav">
                    <div className="icons">
                        <ToolTip message="Linkedin">
                            <a
                                href="https://www.linkedin.com/in/lemnos-company-b73885313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Siga-nos no LinkedIn"
                            >
                                <RiLinkedinFill
                                    className="icon"
                                    aria-hidden="true"
                                />
                            </a>
                        </ToolTip>

                        <ToolTip message="Instagram">
                            <a
                                href="https://www.instagram.com/lemnos_co?igsh=MTZkc2F3eGJ5MW12Ng=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Siga-nos no Instagram"
                            >
                                <RiInstagramFill
                                    className="icon"
                                    aria-hidden="true"
                                />
                            </a>
                        </ToolTip>

                        <ToolTip message="Twitter">
                            <a
                                href="https://x.com/lemnos_co"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Siga-nos no Twitter"
                            >
                                <RiTwitterFill
                                    className="icon"
                                    aria-hidden="true"
                                />
                            </a>
                        </ToolTip>

                        <ToolTip message="Facebook">
                            <a
                                href="https://www.facebook.com/profile.php?id=61561120856036&mibextid=ZbWKwL"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Siga-nos no Facebook"
                            >
                                <RiFacebookFill
                                    className="icon"
                                    aria-hidden="true"
                                />
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
                        aria-label="Visite o site da TechVerse"
                    >
                        TechVerse
                    </a>
                </small>
                <small>
                    <a href="#" aria-label="Termos e Condições">
                        Termos e Condições
                    </a>{' '}
                    |{' '}
                    <a href="#" aria-label="Política de Privacidade">
                        Política de Privacidade
                    </a>
                </small>
            </div>
        </footer>
    );
}
