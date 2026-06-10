import PropTypes from 'prop-types';

import CustomInput from '../../../../components/inputs/customInput/Inputs';
import './userProfile.scss';

export default function UserProfileForm({ form, editing, onChange, onSave }) {
    return (
        <div className="updateInfos">
            <div className="updateInputs">
                <CustomInput
                    type="text"
                    label="Nome Completo:"
                    id="nome"
                    name="nome"
                    maxLength={40}
                    minLength={5}
                    value={form.nome}
                    onChange={onChange}
                    disabled={!editing}
                />

                <CustomInput
                    type="text"
                    label="Email:"
                    id="emailUser"
                    name="email"
                    value={form.email}
                    disabled
                />

                <CustomInput
                    type="text"
                    label="CPF:"
                    id="cpfUser"
                    name="cpf"
                    value={form.cpf}
                    disabled
                />
            </div>

            <div className="containerButtons">
                <button
                    type="button"
                    className="updateButton"
                    disabled={!editing}
                    onClick={onSave}
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
}

UserProfileForm.propTypes = {
    form: PropTypes.object.isRequired,
    editing: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
