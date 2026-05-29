/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import CustomInput from '../../inputs/customInput/Inputs';
import { IoClose } from 'react-icons/io5';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import {
    cadastrarEndereco,
    getEnderecoFromCep,
} from '../../../services/EnderecoService';
import AuthService from '../../../services/AuthService';
import InputError from '../../inputs/inputError/InputError';

export default function EnderecoModal({ onClose }) {
    const [form, setForm] = useState({
        cep: '',
        logradouro: '',
        numeroLogradouro: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
    });
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (form.cep.length == 9) {
            fetchEndereco();
        }
    }, [form.cep]);

    const fetchEndereco = async () => {
        const endereco = await getEnderecoFromCep(form.cep);
        setForm({
            ...form,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.uf,
        });
    };

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
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
            const tokenList = AuthService.getToken().split('.');
            const json = JSON.parse(atob(tokenList[1]));
            const response = await cadastrarEndereco(
                json.sub,
                form,
                json.role.toLowerCase()
            );
            if (response) onClose();
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
                    <div className="inputCep enderecoFormField">
                        <CustomInput
                            type="text"
                            label="CEP:"
                            id="cep"
                            name="cep"
                            mask="CEP"
                            maxLength={9}
                            value={form.cep}
                            onChange={(e) =>
                                setForm({ ...form, cep: e.target.value })
                            }
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
                        {isDropdownOpen ? (
                            <RiArrowDropUpLine
                                className="iconDrop"
                                onClick={handleDropdownToggle}
                            />
                        ) : (
                            <RiArrowDropDownLine
                                className="iconDrop"
                                onClick={handleDropdownToggle}
                            />
                        )}
                        {/* <Dropdown
                            isOpen={isDropdownOpen}
                            options={estados}
                            onSelect={() => {
                                setIsDropdownOpen(false);
                            }}
                            filterFunction={(option) =>
                                option
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            }
                        /> */}
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
                <button type="button" onClick={handleSave}>
                    Salvar
                </button>
            </div>
        </div>
    );
}
