/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import CustomInput from '../../../../components/inputs/customInput/Inputs';
import { IoClose } from 'react-icons/io5';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import {
    cadastrarEndereco,
    getEnderecoFromCep,
} from '../../../../services/EnderecoService';
import AuthService from '../../../../services/AuthService';

// const estados = [
//     'AC',
//     'AL',
//     'AP',
//     'AM',
//     'BA',
//     'CE',
//     'DF',
//     'ES',
//     'GO',
//     'MA',
//     'MT',
//     'MS',
//     'MG',
//     'PA',
//     'PB',
//     'PR',
//     'PE',
//     'PI',
//     'RJ',
//     'RN',
//     'RS',
//     'RO',
//     'RR',
//     'SC',
//     'SP',
//     'SE',
//     'TO',
//     '',
// ];

// const Dropdown = ({ isOpen, options, onSelect, filterFunction }) => {
//     const filteredOptions = filterFunction
//         ? options.filter(filterFunction)
//         : options;

//     return (
//         <div className={`dropdown ${isOpen ? 'open' : ''}`}>
//             {isOpen &&
//                 filteredOptions.map((option, index) => (
//                     <div
//                         key={index}
//                         className="dropdown-estado"
//                         onClick={() => onSelect(option)}
//                     >
//                         {option}
//                     </div>
//                 ))}
//         </div>
//     );
// };

export default function EnderecoModal({ onClose }) {
    const [form, setForm] = useState({
        cep: '',
        logradouro: '',
        nLogradouro: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
    });
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');

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

    // const handleSearch = (value) => {
    //     setSearchTerm(value);
    // };

    const handleSave = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!form.cep) {
            newErrors.cep = 'O Campo CEP é obrigatório';
        }
        if (!form.logradouro) {
            newErrors.logradouro = 'O Campo Logradouro é obrigatório';
        }
        if (!form.nLogradouro) {
            newErrors.nLogradouro =
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
                <h2>Adicionar Endereço</h2>
                <div className="modalEndereco">
                    <div className="inputCep groupInput">
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
                        {errors.cep && (
                            <span className="invalid">{errors.cep}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Estado:"
                            id="estado"
                            name="estado"
                            maxLength={2}
                            value={form.estado}
                            onFocus={handleDropdownToggle}
                            // onChange={(e) => {
                            //     const upperCaseValue =
                            //         e.target.value.toUpperCase();
                            //     handleSearch(upperCaseValue);
                            // }}
                            disabled="disabled"
                        />
                        {errors.estado && (
                            <span className="invalid">{errors.estado}</span>
                        )}
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
                    </div>

                    <div className="groupInput">
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
                        {errors.cidade && (
                            <span className="invalid">{errors.cidade}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                        {errors.bairro && (
                            <span className="invalid">{errors.bairro}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                        {errors.logradouro && (
                            <span className="invalid">{errors.logradouro}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Número do Logradouro:"
                            id="nLogradouro"
                            name="nLogradouro"
                            maxLength={10}
                            value={form.nLogradouro}
                            onChange={(e) =>
                                handleChange('nLogradouro', e.target.value)
                            }
                        />
                        {errors.nLogradouro && (
                            <span className="invalid">
                                {errors.nLogradouro}
                            </span>
                        )}
                    </div>

                    <div className="groupInput">
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
                        {errors.complemento && (
                            <span className="invalid">
                                {errors.complemento}
                            </span>
                        )}
                    </div>
                </div>
                <button type="button" onClick={handleSave}>
                    Salvar
                </button>
                <IoClose onClick={onClose} className="iconClose" />
            </div>
        </div>
    );
}
