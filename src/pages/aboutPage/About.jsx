import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import './about.scss';
import LogoLight from '../../assets/imgLemnos/logoHorizontal.svg';
import LogoDark from '../../assets/imgLemnos/logoHorizontalClaro.svg';
import TechFesto from '../../assets/imgLemnos/imgMascote.svg';
import InfoSection from './components/InfoSection';
import InfoCard from './components/InfoCard';
import { VALUES } from '../../constants/values';

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
            <InfoSection
                title="Sobre"
                imageDark={LogoDark}
                imageLight={LogoLight}
                paragraphs={[
                    'Desde sua fundação em 2023, a Lemnos vem se consolidando como uma referência no mercado tecnológico, guiada por uma visão inovadora e pelo compromisso constante com a evolução. Mais do que oferecer produtos, buscamos criar experiências que acompanhem o ritmo acelerado das transformações digitais, sempre atentos às necessidades de um público cada vez mais conectado e exigente.',

                    'Ao longo dessa trajetória, ampliamos continuamente nosso portfólio com soluções modernas e acessíveis, priorizando qualidade, confiabilidade e desempenho. Nossa equipe, formada por profissionais apaixonados por tecnologia, trabalha diariamente para garantir não apenas uma compra, mas uma jornada completa — desde a escolha do produto até o suporte pós-venda.',

                    'Na Lemnos, acreditamos que a tecnologia deve ser um elo entre pessoas, ideias e oportunidades. Por isso, cada detalhe da nossa plataforma é pensado para facilitar o acesso ao que há de mais avançado no mercado, transformando desafios em soluções práticas e contribuindo diretamente para o crescimento pessoal e profissional dos nossos clientes.',
                ]}
            />

            <section className="valuesContent">
                <div className="content">
                    {VALUES.map((item) => (
                        <InfoCard
                            key={item.title}
                            title={item.title}
                            text={item.text}
                        />
                    ))}
                </div>
            </section>

            <InfoSection
                title="TechFesto"
                image={TechFesto}
                imageClass="imgMascot"
                paragraphs={[
                    'Na Lemnos, nosso mascote TechFesto representa muito mais do que uma simples identidade visual — ele simboliza a união entre o conhecimento ancestral e a inovação tecnológica. Inspirado pela mitologia e impulsionado pelo futuro, ele traduz a essência da nossa marca em cada detalhe.',

                    'Como um verdadeiro guardião da tecnologia, TechFesto acompanha nossos clientes em uma jornada de descobertas, utilizando sua sabedoria para revelar novas possibilidades e incentivar a exploração de soluções criativas e eficientes.',

                    'Com seu espírito curioso e visão estratégica, TechFesto motiva nossa equipe a ir além, conectando tradição e inovação de forma única. Ele é o símbolo de uma jornada contínua de evolução, onde passado e futuro se encontram para construir algo extraordinário.',
                ]}
            />
        </main>
    );
}
