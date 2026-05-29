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
import { getQuantidadeCarrinho } from '../../../services/UsuarioProdutoService';
import cartEventEmitter from '../../../services/configurations/events';

export default function Header({ toggleTheme }) {
    const [shrinkHeader, setShrinkHeader] = useState(false);
    const [showFavoriteMenu, setShowFavoriteMenu] = useState(false);
    const [carrinho, setCarrinho] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(
        AuthService.isLoggedIn() || AuthService.isLoggedInWithGoogle()
    );

    useEffect(() => {
        fetchCarrinho();

        const handleUpdateCart = () => {
            fetchCarrinho();
        };

        cartEventEmitter.on('updateCart', handleUpdateCart);

        return () => {
            cartEventEmitter.off('updateCart', handleUpdateCart);
        };
    }, []);

    const fetchCarrinho = async () => {
        if (AuthService.isLoggedIn()) {
            try {
                const response = await getQuantidadeCarrinho();
                setCarrinho(response > 0 ? response : null);
            } catch (error) {
                setCarrinho(null);
            }
        }
    };

    const userImg = useSelector(
        (state) => state.user.userImg || AuthService.getGoogleProfilePhoto()
    );

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

    useEffect(() => {
        const handleAuthChange = (loggedIn) => {
            setIsLoggedIn(loggedIn);
        };

        AuthService.subscribe(handleAuthChange);

        return () => {
            AuthService.unsubscribe(handleAuthChange);
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

                <Link to="/" className="logo">
                    Lemnos
                </Link>

                <nav>
                    <ul className="navegation">
                        <Link to="/about" className="link">
                            Sobre
                        </Link>
                    </ul>
                </nav>

                <MenuSearch />

                <nav className="menuDesktop">
                    <a href="#" onClick={handleShowMenuFav}>
                        <RiHeartLine className="favIcon" />
                    </a>
                    <Link to="/auth" className="linkIcons">
                        {userImg && isLoggedIn ? (
                            <img src={userImg} alt="User" className="userImg" />
                        ) : (
                            <RiUser3Line className="userIcon" />
                        )}
                    </Link>
                    <Link to="/cart" className="linkIcons">
                        {isLoggedIn && carrinho !== null && carrinho > 0 ? (
                            <>
                                <span className="spanCarrinhoLength">
                                    {carrinho}
                                </span>
                                <RiShoppingCartLine className="cartIcon" />
                            </>
                        ) : (
                            <>
                                <RiShoppingCartLine className="cartIcon" />
                            </>
                        )}
                    </Link>
                </nav>
            </header>

            {showFavoriteMenu && <MenuFavorite onClose={handleCloseMenuFav} />}
        </>
    );
}

Header.propTypes = {
    toggleTheme: PropTypes.func.isRequired,
};
