import { useEffect, useState } from 'react';
import imgBtnScroll from '../../../assets/icons/btnScrollToTop.svg';
import AuthService from '../../../services/AuthService';

export default function BackToTopButton() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const color = AuthService.getTheme() === 'light' ? '#36CEC4' : '#10A88D';

    useEffect(() => {
        const handleScroll = () => {
            const position = document.documentElement.scrollTop;
            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            const percentage =
                height > 0 ? Math.round((position * 100) / height) : 0;

            setProgress(percentage);
            setIsVisible(position > 100);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <section className="scrollBtn">
            <div
                className={`progressBar ${isVisible ? 'visible' : ''}`}
                onClick={scrollToTop}
                style={{
                    background: `conic-gradient(${color} ${progress}%, #2D3A3A ${progress}%)`,
                }}
            >
                <img
                    src={imgBtnScroll}
                    alt="Voltar ao topo"
                    className="arrowUp"
                />
            </div>
        </section>
    );
}
