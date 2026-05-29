import { FaExclamation } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './notFound.scss';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <section className="bgScreen">
            <div className="notFound">
                <h1>404</h1>
                <FaExclamation className="iconError" />
            </div>
            <div className="desc">
                <h3>Página não encontrada</h3>
                <p>
                    A página que você procura não existe ou não está disponível
                    no momento.
                </p>
            </div>
            <button className="btnHome" onClick={() => navigate('/')}>
                Voltar para o início
            </button>
        </section>
    );
}
