import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import CustomInput from '../../inputs/customInput/Inputs';
import { IoClose } from 'react-icons/io5';
import {
    cadastrarEndereco,
    getEnderecoFromCep,
} from '../../../services/EnderecoService';
import AuthService from '../../../services/AuthService';
import InputError from '../../inputs/inputError/InputError';

export default function EnderecoModal({ onClose, initialCep, onSuccess }) {
    const [form, setForm] = useState({
        cep: initialCep || '',
        logradouro: '',
        numeroLogradouro: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
    });
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEndereco = useCallback(async () => {
        setIsLoading(true);
        try {
            const endereco = await getEnderecoFromCep(form.cep);

            if (!endereco || !endereco.logradouro) {
                throw new Error('CEP não encontrado');
            }

            setForm((prevForm) => ({
                ...prevForm,
                logradouro: endereco.logradouro || '',
                bairro: endereco.bairro || '',
                cidade: endereco.cidade || '',
                estado: endereco.uf || '',
            }));
            toast.success('CEP encontrado com sucesso!');
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            toast.error('CEP não encontrado. Verifique o número digitado.');
            setForm((prevForm) => ({
                ...prevForm,
                logradouro: '',
                bairro: '',
                cidade: '',
                estado: '',
            }));
        } finally {
            setIsLoading(false);
        }
    }, [form.cep]);

    useEffect(() => {
        if (form.cep.length === 9 && /^\d{5}-\d{3}$/.test(form.cep)) {
            fetchEndereco();
        }
    }, [form.cep, fetchEndereco]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleCepChange = (e) => {
        const value = e.target.value;
        setForm((prevForm) => ({
            ...prevForm,
            cep: value,
            logradouro: value.length < 9 ? '' : prevForm.logradouro,
            bairro: value.length < 9 ? '' : prevForm.bairro,
            cidade: value.length < 9 ? '' : prevForm.cidade,
            estado: value.length < 9 ? '' : prevForm.estado,
        }));
        if (errors.cep) {
            setErrors((prev) => ({ ...prev, cep: '' }));
        }
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!form.cep) {
            newErrors.cep = 'O Campo CEP é obrigatório';
        }
        if (!form.logradouro) {
            newErrors.logradouro = 'O Campo Logradouro é obrigatório';
        }
        if (!form.numeroLogradouro) {
            newErrors.numeroLogradouro =
                'O Campo Número do Logradouro é obrigatório';
        }
        if (!form.bairro) {
            newErrors.bairro = 'O Campo Bairro é obrigatório';
        }
        if (!form.cidade) {
            newErrors.cidade = 'O Campo Cidade é obrigatória';
        }
        if (!form.estado) {
            newErrors.estado = 'O Campo Estado é obrigatório';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const tokenList = AuthService.getToken().split('.');
                const json = JSON.parse(atob(tokenList[1]));
                const response = await cadastrarEndereco(
                    json.sub,
                    form,
                    json.role.toLowerCase()
                );

                if (response) {
                    toast.success('Endereço adicionado com sucesso!');

                    if (onSuccess) {
                        await onSuccess();
                    }

                    onClose();
                }
            } catch (error) {
                console.error('Erro ao salvar endereço:', error);
                toast.error('Erro ao salvar endereço. Tente novamente.');
            }
        }
    };

    return (
        <div className="modal" onClick={onClose}>
            <div
                className="containerModal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="headerModal">
                    <IoClose className="iconClose" onClick={onClose} />
                    <h2>Adicionar Endereço</h2>
                </div>
                <div className="modalEndereco">
                    {isLoading && (
                        <div className="loadingMessage">
                            Buscando endereço...
                        </div>
                    )}

                    <div className="inputCep enderecoFormField">
                        <CustomInput
                            type="text"
                            label="CEP:"
                            id="cep"
                            name="cep"
                            mask="CEP"
                            maxLength={9}
                            value={form.cep}
                            onChange={handleCepChange}
                        />
                        <InputError error={errors.cep} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Estado:"
                            id="estado"
                            name="estado"
                            maxLength={2}
                            value={form.estado}
                            onFocus={handleDropdownToggle}
                            disabled="disabled"
                        />
                        <InputError error={errors.estado} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Cidade:"
                            id="cidade"
                            name="cidade"
                            maxLength={40}
                            value={form.cidade}
                            onChange={(e) =>
                                handleChange('cidade', e.target.value)
                            }
                            disabled="disabled"
                        />
                        <InputError error={errors.cidade} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Bairro:"
                            id="bairro"
                            name="bairro"
                            maxLength={40}
                            value={form.bairro}
                            onChange={(e) =>
                                handleChange('bairro', e.target.value)
                            }
                            disabled="disabled"
                        />
                        <InputError error={errors.bairro} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Logradouro:"
                            id="logradouro"
                            name="logradouro"
                            maxLength={50}
                            value={form.logradouro}
                            onChange={(e) =>
                                handleChange('logradouro', e.target.value)
                            }
                            disabled="disabled"
                        />
                        <InputError error={errors.logradouro} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Número do Logradouro:"
                            id="numeroLogradouro"
                            name="numeroLogradouro"
                            maxLength={10}
                            value={form.numeroLogradouro}
                            onChange={(e) =>
                                handleChange('numeroLogradouro', e.target.value)
                            }
                        />
                        <InputError error={errors.numeroLogradouro} />
                    </div>

                    <div className="enderecoFormField">
                        <CustomInput
                            type="text"
                            label="Complemento:"
                            id="complemento"
                            name="complemento"
                            maxLength={40}
                            value={form.complemento}
                            onChange={(e) =>
                                handleChange('complemento', e.target.value)
                            }
                        />
                        <InputError error={errors.complemento} />
                    </div>
                </div>
                <button
                    type="button"
                    className="addEnderecoButton"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Carregando...' : 'Salvar'}
                </button>
            </div>
        </div>
    );
}

EnderecoModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    initialCep: PropTypes.string,
    onSuccess: PropTypes.func,
};
