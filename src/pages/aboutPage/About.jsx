import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import './about.scss';
import LogoHorizontalLight from '../../assets/imgLemnos/logoHorizontal.svg';
import LogoHorizontalDark from '../../assets/imgLemnos/logoHorizontalClaro.svg';
import TechFesto from '../../assets/imgLemnos/imgMascote.svg';

export default function About() {
    useEffect(() => {
        ScrollReveal().reveal('.text', {
            origin: 'left',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });

        ScrollReveal().reveal('.logoDark, .logoLight, .imgMascot', {
            origin: 'right',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });

        ScrollReveal().reveal('.item', {
            origin: 'bottom',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });
    }, []);

    return (
        <main>
            <section className="aboutContent">
                <div className="title">
                    <hr />
                    <h2>Sobre</h2>
                    <hr />
                </div>

                <div className="content">
                    <div className="textContainer">
                        <p className="text">
                            Desde sua fundação em 2023, a Lemnos vem se
                            consolidando como uma referência no mercado
                            tecnológico, guiada por uma visão inovadora e pelo
                            compromisso constante com a evolução. Mais do que
                            oferecer produtos, buscamos criar experiências que
                            acompanhem o ritmo acelerado das transformações
                            digitais, sempre atentos às necessidades de um
                            público cada vez mais conectado e exigente.
                        </p>
                        <p className="text">
                            Ao longo dessa trajetória, ampliamos continuamente
                            nosso portfólio com soluções modernas e acessíveis,
                            priorizando qualidade, confiabilidade e desempenho.
                            Nossa equipe, formada por profissionais apaixonados
                            por tecnologia, trabalha diariamente para garantir
                            não apenas uma compra, mas uma jornada completa —
                            desde a escolha do produto até o suporte pós-venda.
                        </p>
                        <p className="text">
                            Na Lemnos, acreditamos que a tecnologia deve ser um
                            elo entre pessoas, ideias e oportunidades. Por isso,
                            cada detalhe da nossa plataforma é pensado para
                            facilitar o acesso ao que há de mais avançado no
                            mercado, transformando desafios em soluções práticas
                            e contribuindo diretamente para o crescimento
                            pessoal e profissional dos nossos clientes.
                        </p>
                    </div>
                    <img
                        className="logoDark"
                        src={LogoHorizontalLight}
                        alt="logo"
                    />
                    <img
                        className="logoLight"
                        src={LogoHorizontalDark}
                        alt="logo"
                    />
                </div>
            </section>

            <section className="valuesContent">
                <div className="content">
                    <div className="item">
                        <h3>Missão</h3>
                        <p>
                            Na Lemnos, nossa missão é tornar a tecnologia cada
                            vez mais acessível, conectando pessoas a soluções
                            inovadoras que realmente fazem diferença no dia a
                            dia. Buscamos democratizar o acesso a produtos de
                            qualidade, mantendo um equilíbrio entre preço justo,
                            desempenho e confiabilidade, para que cada cliente
                            possa evoluir junto com o avanço tecnológico.
                        </p>
                    </div>
                    <div className="item">
                        <h3>Plataforma</h3>
                        <p>
                            A plataforma Lemnos foi desenvolvida para oferecer
                            uma experiência intuitiva, moderna e eficiente. Com
                            uma interface amigável e organizada, proporcionamos
                            uma navegação simples e personalizada, permitindo
                            que cada usuário encontre exatamente o que precisa
                            com facilidade, enquanto explora um catálogo
                            completo de produtos tecnológicos de ponta.
                        </p>
                    </div>
                    <div className="item">
                        <h3>Valores</h3>
                        <p>
                            Nossos valores são fundamentados na excelência, na
                            transparência e no compromisso com a satisfação do
                            cliente. Valorizamos a inovação, o aprendizado
                            contínuo e a construção de um ambiente acolhedor,
                            capaz de atender tanto iniciantes quanto entusiastas
                            da tecnologia, sempre com foco em entregar soluções
                            relevantes e experiências memoráveis.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mascotContent">
                <div className="title">
                    <hr />
                    <h2>TechFesto</h2>
                    <hr />
                </div>

                <div className="content">
                    <div className="textContainer">
                        <p className="text">
                            Na Lemnos, nosso mascote TechFesto representa muito
                            mais do que uma simples identidade visual — ele
                            simboliza a união entre o conhecimento ancestral e a
                            inovação tecnológica. Inspirado pela mitologia e
                            impulsionado pelo futuro, ele traduz a essência da
                            nossa marca em cada detalhe.
                        </p>
                        <p className="text">
                            Como um verdadeiro guardião da tecnologia, TechFesto
                            acompanha nossos clientes em uma jornada de
                            descobertas, utilizando sua sabedoria para revelar
                            novas possibilidades e incentivar a exploração de
                            soluções criativas e eficientes.
                        </p>
                        <p className="text">
                            Com seu espírito curioso e visão estratégica,
                            TechFesto motiva nossa equipe a ir além, conectando
                            tradição e inovação de forma única. Ele é o símbolo
                            de uma jornada contínua de evolução, onde passado e
                            futuro se encontram para construir algo
                            extraordinário.
                        </p>
                    </div>
                    <img
                        src={TechFesto}
                        alt="Mascote TechFesto"
                        className="imgMascot"
                    />
                </div>
            </section>
        </main>
    );
}
