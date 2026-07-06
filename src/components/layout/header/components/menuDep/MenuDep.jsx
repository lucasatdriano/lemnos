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
        <nav className="menuCat">
            <a href="#" onClick={toggleMenu} className="menuButton">
                <RiMenuUnfoldLine className="menuIcon" />
            </a>

            <div
                onClick={handleCloseMenu}
                className={`modalDep ${isActive ? 'active' : ''}`}
            ></div>

            <nav
                ref={dropDownRef}
                className={`menu ${isActive ? 'active' : ''}`}
            >
                <Link to="/" className="link" onClick={handleCloseMenu}>
                    <img src={LogoHorizontal} alt="Logo" className="logoMenu" />
                </Link>
                <hr className="hrMenu" />

                <h3>Departamentos</h3>

                <hr className="hrMenu" />
                <ul className="categorias">
                    <Link
                        to="/productFilter/Periféricos"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Periféricos
                    </Link>
                    <Link
                        to="/productFilter/Hardware"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Hardware
                    </Link>
                    <Link
                        to="/productFilter/Computadores"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Computadores
                    </Link>
                    <Link
                        to="/productFilter/Kits"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Kits
                    </Link>
                    <Link
                        to="/productFilter/Eletrônicos"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Eletrônicos
                    </Link>
                    <Link
                        to="/productFilter/Notebooks e Portáteis"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Notebooks e Portáteis
                    </Link>
                    <Link
                        to="/productFilter/Video Games"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Video Games
                    </Link>
                    <Link
                        to="/productFilter/Redes e Wireless"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Redes e Wireless
                    </Link>
                    <Link
                        to="/productFilter/Realidade Virtual"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Realidade Virtual
                    </Link>
                    <Link
                        to="/productFilter/Casa Inteligente"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Casa Inteligente
                    </Link>
                    <Link
                        to="/productFilter/Monitores"
                        className="filterDeps"
                        onClick={handleCloseMenu}
                    >
                        Monitores
                    </Link>
                </ul>

                <hr className="hrMenu" />
                <h3>Navegação</h3>
                <hr className="hrMenu" />
                <nav className="menuNav">
                    <ul className="navegacoes">
                        <Link to="/" className="link" onClick={handleCloseMenu}>
                            <RiHome4Line className="homeIcon" />
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="link"
                            onClick={handleCloseMenu}
                        >
                            <AiOutlineTeam className="aboutIcon" />
                            Sobre
                        </Link>
                        <Link
                            to="#"
                            className="link"
                            onClick={() => {
                                showMenuFav();
                                handleCloseMenu();
                            }}
                        >
                            <RiHeartLine className="favIcon" />
                            Favoritos
                        </Link>
                        <Link
                            to="/auth"
                            className="link"
                            onClick={handleCloseMenu}
                        >
                            <RiUser3Line className="userIcon" />
                            Conta
                        </Link>
                        <Link
                            to="/cart"
                            className="link"
                            onClick={handleCloseMenu}
                        >
                            <RiShoppingCartLine className="cartIcon" />
                            Carrinho
                        </Link>
                    </ul>
                </nav>

                <div className="toggleTheme">
                    <input
                        type="checkbox"
                        className="checkbox"
                        onClick={handleThemeToggle}
                        checked={isDarkTheme}
                        onChange={handleThemeToggle}
                        id="chk"
                        name="chk"
                    />
                    <label htmlFor="chk" id="labelTheme">
                        <RiSunLine className="iconSun" />
                        <RiMoonLine className="iconMoon" />
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
