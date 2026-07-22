import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogoHorizontal from '../../../../../assets/imgLemnos/logoHorizontalClaro.svg';
import { AiOutlineTeam } from 'react-icons/ai';
import {
    RiMenuUnfoldLine,
    RiHome4Line,
    RiShoppingCartLine,
    RiHeartLine,
    RiUser3Line,
    RiSunLine,
    RiMoonLine,
} from 'react-icons/ri';
import AuthService from '../../../../../services/AuthService';
import './menuDep.scss';

export default function MenuDep({ toggleTheme, showMenuFav }) {
    const dropDownRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isActive]);

    useEffect(() => {
        if (AuthService.getTheme() === 'dark') {
            setIsDarkTheme(true);
        }
    }, []);

    const toggleMenu = () => {
        setIsActive(!isActive);
        toggleModal();
    };

    const toggleModal = () => {
        const htmlTag = document.querySelector('html');
        if (isActive) {
            htmlTag.classList.remove('modalOpen');
        } else {
            htmlTag.classList.add('modalOpen');
        }
    };

    const handleCloseMenu = () => {
        setIsActive(false);
        const htmlTag = document.querySelector('html');
        htmlTag.classList.remove('modalOpen');
    };

    const handleThemeToggle = () => {
        setIsDarkTheme(!isDarkTheme);
        toggleTheme();
    };

    return (
        <nav className="menuCat" aria-label="Menu de departamentos">
            <a
                href="#"
                onClick={toggleMenu}
                className="menuButton"
                aria-label="Abrir menu de navegação"
                aria-expanded={isActive}
                aria-controls="menuDropdown"
            >
                <RiMenuUnfoldLine className="menuIcon" aria-hidden="true" />
            </a>

            <div
                onClick={handleCloseMenu}
                className={`modalDep ${isActive ? 'active' : ''}`}
                aria-hidden="true"
            ></div>

            <nav
                ref={dropDownRef}
                className={`menu ${isActive ? 'active' : ''}`}
                id="menuDropdown"
                aria-label="Menu de navegação principal"
                aria-hidden={!isActive}
            >
                <Link
                    to="/"
                    className="link"
                    onClick={handleCloseMenu}
                    aria-label="Página inicial Lemnos"
                >
                    <img
                        src={LogoHorizontal}
                        alt="Logo Lemnos - Página inicial"
                        className="logoMenu"
                    />
                </Link>
                <hr className="hrMenu" />

                <h3>Departamentos</h3>

                <hr className="hrMenu" />
                <ul className="categorias" aria-label="Lista de departamentos">
                    <li>
                        <Link
                            to="/productFilter/Periféricos"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Periféricos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Hardware"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Hardware
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Computadores"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Computadores
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Kits"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Kits
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Eletrônicos"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Eletrônicos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Notebooks e Portáteis"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Notebooks e Portáteis
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Video Games"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Video Games
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Redes e Wireless"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Redes e Wireless
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Realidade Virtual"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Realidade Virtual
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Casa Inteligente"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Casa Inteligente
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/productFilter/Monitores"
                            className="filterDeps"
                            onClick={handleCloseMenu}
                        >
                            Monitores
                        </Link>
                    </li>
                </ul>

                <hr className="hrMenu" />
                <h3>Navegação</h3>
                <hr className="hrMenu" />

                <nav className="menuNav" aria-label="Links de navegação">
                    <ul className="navegacoes">
                        <li>
                            <Link
                                to="/"
                                className="link"
                                onClick={handleCloseMenu}
                                aria-label="Página inicial"
                            >
                                <RiHome4Line
                                    className="homeIcon"
                                    aria-hidden="true"
                                />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="link"
                                onClick={handleCloseMenu}
                                aria-label="Sobre a Lemnos"
                            >
                                <AiOutlineTeam
                                    className="aboutIcon"
                                    aria-hidden="true"
                                />
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#"
                                className="link"
                                onClick={() => {
                                    showMenuFav();
                                    handleCloseMenu();
                                }}
                                aria-label="Lista de favoritos"
                            >
                                <RiHeartLine
                                    className="favIcon"
                                    aria-hidden="true"
                                />
                                Favoritos
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/auth"
                                className="link"
                                onClick={handleCloseMenu}
                                aria-label="Minha conta"
                            >
                                <RiUser3Line
                                    className="userIcon"
                                    aria-hidden="true"
                                />
                                Conta
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cart"
                                className="link"
                                onClick={handleCloseMenu}
                                aria-label="Carrinho de compras"
                            >
                                <RiShoppingCartLine
                                    className="cartIcon"
                                    aria-hidden="true"
                                />
                                Carrinho
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="toggleTheme" aria-label="Alternar tema">
                    <input
                        type="checkbox"
                        className="checkbox"
                        onClick={handleThemeToggle}
                        checked={isDarkTheme}
                        onChange={handleThemeToggle}
                        id="chk"
                        name="chk"
                        aria-label="Alternar entre tema claro e escuro"
                    />
                    <label htmlFor="chk" id="labelTheme">
                        <RiSunLine className="iconSun" aria-hidden="true" />
                        <RiMoonLine className="iconMoon" aria-hidden="true" />
                        <div className="ball"></div>
                    </label>
                </div>
            </nav>
        </nav>
    );
}

MenuDep.propTypes = {
    toggleTheme: PropTypes.func.isRequired,
    showMenuFav: PropTypes.func.isRequired,
};
