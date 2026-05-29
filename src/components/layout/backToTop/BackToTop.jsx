/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import imgBtnScroll from '../../../assets/icons/btnScrollToTop.svg';
import AuthService from '../../../services/AuthService';

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const cvlScroll = () => {
        const progressBar = document.getElementById('progressBar');
        const position = document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const vlScroll = Math.round((position * 100) / height);

        if (position > 100) {
            progressBar.style.display = 'grid';
            progressBar.classList.add('visible');
        } else {
            progressBar.style.display = 'none';
            progressBar.classList.remove('visible');
        }

        if (AuthService.getTheme() === 'light') {
            progressBar.style.background = `conic-gradient(#36CEC4 ${vlScroll}%, #2D3A3A ${vlScroll}%)`;
        } else {
            progressBar.style.background = `conic-gradient(#10a88d ${vlScroll}%, #2D3A3A ${vlScroll}%)`;
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', cvlScroll);
        window.addEventListener('load', cvlScroll);

        return () => {
            window.removeEventListener('scroll', cvlScroll);
            window.removeEventListener('load', cvlScroll);
        };
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
                id="progressBar"
                onClick={scrollToTop}
            >
                <img src={imgBtnScroll} alt="iconArrow" className="arrowUp" />
            </div>
        </section>
    );
}
