import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiShoppingCartLine, RiHeartLine, RiUser3Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MenuDep from './components/menuDep/MenuDep';
import MenuSearch from './components/searchMenu/MenuSearch';
import MenuFavorite from './components/favoriteMenu/MenuFavorite';
import AuthService from '../../../services/AuthService';
import './header.scss';
import cartEventEmitter from '../../../services/configurations/events';
import { useAuth } from '../../../hooks/useAuth';

export default function Header({ toggleTheme }) {
    const { isAuthenticated } = useAuth();
    const [shrinkHeader, setShrinkHeader] = useState(false);
    const [showFavoriteMenu, setShowFavoriteMenu] = useState(false);

    const cart = useSelector((state) => state.cart.items);

    const userImg = useSelector(
        (state) => state.user.userImg || AuthService.getGoogleProfilePhoto()
    );

    const quantidadeCarrinho = cart?.length || 0;

    useEffect(() => {
        const handleUpdateCart = () => {};

        cartEventEmitter.on('updateCart', handleUpdateCart);

        return () => {
            cartEventEmitter.off('updateCart', handleUpdateCart);
        };
    }, []);

    useEffect(() => {
        if (showFavoriteMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showFavoriteMenu]);

    const handleShowMenuFav = () => {
        setShowFavoriteMenu(true);
        const htmlTag = document.querySelector('html');
        htmlTag.classList.add('modalOpen');
    };

    const handleCloseMenuFav = () => {
        setShowFavoriteMenu(false);
        const htmlTag = document.querySelector('html');
        htmlTag.classList.remove('modalOpen');
    };

    useEffect(() => {
        const handleScroll = () => {
            setShrinkHeader(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header className={`header ${shrinkHeader ? 'shrink' : ''}`}>
                <MenuDep
                    toggleTheme={toggleTheme}
                    showMenuFav={handleShowMenuFav}
                    className="menuDepartamento"
                />

                <Link
                    to="/"
                    className="logo"
                    aria-label="Página inicial Lemnos"
                >
                    Lemnos
                </Link>

                <nav aria-label="Navegação principal">
                    <ul>
                        <li className="navegation">
                            <Link
                                to="/about"
                                className="link"
                                aria-label="Sobre a Lemnos"
                            >
                                Sobre
                            </Link>
                        </li>
                    </ul>
                </nav>

                <MenuSearch />

                <nav className="menuDesktop" aria-label="Menu do usuário">
                    <a
                        href="#"
                        onClick={handleShowMenuFav}
                        aria-label="Abrir lista de favoritos"
                    >
                        <RiHeartLine className="favIcon" aria-hidden="true" />
                    </a>

                    <Link
                        to="/auth"
                        className="linkIcons"
                        aria-label={
                            isAuthenticated
                                ? 'Perfil do usuário'
                                : 'Fazer login'
                        }
                    >
                        {userImg && isAuthenticated ? (
                            <img
                                src={userImg}
                                alt="Foto do perfil do usuário"
                                className="userImg"
                            />
                        ) : (
                            <RiUser3Line
                                className="userIcon"
                                aria-hidden="true"
                            />
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        className="linkIcons"
                        aria-label={`Carrinho de compras${quantidadeCarrinho > 0 ? `, ${quantidadeCarrinho} itens` : ''}`}
                    >
                        {quantidadeCarrinho > 0 && (
                            <span
                                className="spanCarrinhoLength"
                                aria-hidden="true"
                            >
                                {quantidadeCarrinho}
                            </span>
                        )}
                        <RiShoppingCartLine
                            className="cartIcon"
                            aria-hidden="true"
                        />
                    </Link>
                </nav>
            </header>

            <MenuFavorite
                onClose={handleCloseMenuFav}
                isOpen={showFavoriteMenu}
            />
        </>
    );
}

Header.propTypes = {
    toggleTheme: PropTypes.func.isRequired,
};
