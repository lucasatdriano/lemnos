import './infos.scss';
import { RiTimeLine, RiPhoneFill } from 'react-icons/ri';
import { TbMailFilled } from 'react-icons/tb';

export default function Infos() {
    return (
        <>
            <section className="infosContent">
                <div className="containerService">
                    <div className="containerIcon">
                        <RiTimeLine className="icon" />
                    </div>
                    <p>
                        Atendimento - Segunda a sexta 7h às 12h e das 14h às 20h
                    </p>
                </div>
                <div className="containerPhone">
                    <div className="containerIcon">
                        <RiPhoneFill className="icon" />
                    </div>
                    <p>(11) 93834-4111</p>
                </div>
                <div className="containerMail">
                    <div className="containerIcon">
                        <TbMailFilled className="icon" />
                    </div>
                    <p>sac@lemnos.com.br</p>
                </div>
            </section>
        </>
    );
}
