import './global.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/layout/header/Header';
import BackToTopButton from './components/layout/backToTop/BackToTop';
import Footer from './components/layout/footer/Footer';
import AnimatedRoutes from './AnimatedRoutes';
import { AuthProvider } from './AuthProvider';
import { NavigationProvider } from './NavigationProvider';
import AuthService from './services/AuthService';

export default function App() {
    const [theme, setTheme] = useState(AuthService.getTheme() || 'dark');
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        AuthService.setTheme(newTheme);
    };

    return (
        <AuthProvider>
            <NavigationProvider>
                <section className={`${AuthService.getTheme()}`}>
                    <Header toggleTheme={toggleTheme} />
                    <AnimatedRoutes />
                    <BackToTopButton />
                    <ToastContainer position="bottom-right" />
                    <Footer />
                </section>
            </NavigationProvider>
        </AuthProvider>
    );
}
