/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import CustomInput from '../../../../../components/inputs/customInput/Inputs';
import UpdateFornModal from './UpdateFornModal';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import {
    verificarCep,
    cadastrarEndereco,
    updateEndereco,
} from '../../../../../services/EnderecoService';
import {
    cadastrarFornecedor,
    updateFornecedor,
    getFornecedorByEmail,
} from '../../../../../services/FornecedorService';

export default function FornecedorModal({ onClose, tipoEntidade }) {
    const initialFormState = {
        nome: '',
        email: '',
        telefone: '',
        cnpj: '',
        endereco: {
            cep: '',
            nLogradouro: '',
            complemento: '',
        },
    };
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isFornecedorListOpen, setIsFornecedorListOpen] = useState(false);
    const [selectedForn, setSelectedForn] = useState(null);

    const handleFornecedorListToggle = () => {
        setForm(initialFormState);
        setIsFornecedorListOpen(!isFornecedorListOpen);
    };

    const selectFornecedor = async (email) => {
        try {
            const fornecedor = await getFornecedorByEmail(email);
            if (!fornecedor) {
                throw new Error('Dados do fornecedor não encontrados.');
            }

            setForm({
                nome: fornecedor.nome || '',
                cnpj: fornecedor.cnpj || '',
                telefone: fornecedor.telefone || '',
                email: fornecedor.email || '',
                endereco: {
                    cep: fornecedor.endereco
                        ? fornecedor.endereco.cep || ''
                        : '',
                    nLogradouro: fornecedor.endereco
                        ? fornecedor.endereco.numeroLogradouro || ''
                        : '',
                    complemento: fornecedor.endereco
                        ? fornecedor.endereco.complemento || ''
                        : '',
                },
            });

            setSelectedForn(fornecedor);
            setIsFornecedorListOpen(false);
        } catch (error) {
            console.error('Erro ao carregar dados do fornecedor:', error);
            toast.error('Erro ao carregar dados do fornecedor.', {
                position: "bottom-right"
            });
            throw error;
        }
    };

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.nome) {
            newErrors.nome = 'O Nome do fornecedor é obrigatório';
        }
        if (!form.email) {
            newErrors.email = 'O Email do fornecedor é obrigatório';
        }
        if (!form.telefone) {
            newErrors.telefone = 'O Telefone é obrigatório';
        }
        if (!form.cnpj) {
            newErrors.cnpj = 'O CNPJ é obrigatório';
        }
        if (!form.endereco.cep) {
            newErrors.cep = 'O Cep é obrigatório';
        }
        if (!form.endereco.nLogradouro) {
            newErrors.nLogradouro = 'O Número de Logradouro é obrigatório';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formattedForm = {
                ...form,
                nome: form.nome ? form.nome : '',
                cnpj: String(form.cnpj).replace(/\D/g, ''),
                telefone: String(form.telefone)
                    .replace(/\D/g, '')
                    .substring(0, 11),
                endereco: {
                    ...form.endereco,
                    cep:
                        form.endereco && form.endereco.cep
                            ? String(form.endereco.cep).replace(/\D/g, '')
                            : '',
                },
            };

            try {
                const cepValido = await verificarCep(
                    formattedForm.endereco.cep
                );
                if (!cepValido) {
                    toast.error('CEP não existente.', {
                        position: "bottom-right"
                    });
                    return;
                }

                const entidadeCadastrada = await cadastrarFornecedor(
                    formattedForm,
                    tipoEntidade
                );

                if (entidadeCadastrada) {
                    const enderecoResponse = await cadastrarEndereco(
                        formattedForm.email,
                        formattedForm.endereco,
                        tipoEntidade
                    );
                    setSelectedForn(null);
                    setForm(initialFormState);
                }
            } catch (error) {
                console.error('Erro ao cadastrar fornecedor:', error);
                toast.error('Erro ao cadastrar fornecedor.', {
                    position: "bottom-right"
                });
                throw error;
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formattedForm = {
                ...form,
                nome: form.nome ? form.nome.toLowerCase() : '',
                cnpj: String(form.cnpj).replace(/\D/g, ''),
                telefone: String(form.telefone)
                    .replace(/\D/g, '')
                    .substring(0, 11),
                endereco: {
                    ...form.endereco,
                    cep:
                        form.endereco && form.endereco.cep
                            ? String(form.endereco.cep).replace(/\D/g, '')
                            : '',
                },
            };

            try {
                const cepValido = await verificarCep(
                    formattedForm.endereco.cep
                );
                if (!cepValido) {
                    toast.error('CEP não existente.', {
                        position: "bottom-right"
                    });
                    return;
                }

                const entidadeAtualizada =
                    await updateFornecedor(formattedForm);

                if (entidadeAtualizada === true) {
                    let enderecoAtualizada = await updateEndereco(
                        formattedForm.email,
                        formattedForm.endereco,
                        tipoEntidade
                    );

                    if (enderecoAtualizada === true) {
                        toast.success('Fornecedor atualizado', {
                            position: "bottom-right"
                        });
                        setSelectedForn(null);
                        setForm(initialFormState);
                        return;
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar fornecedor:', error);
                toast.error('Erro ao atualizar fornecedor.', {
                    position: "bottom-right"
                });
                throw error;
            }
        }
    };

    const isFornSelected = () => {
        return selectedForn !== null;
    };

    return (
        <div className="modal" onClick={onClose}>
            <div
                className="containerModal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Adicionar/Atualizar Fornecedor</h2>
                <div className="modalFornecedor">
                    <div className="inputNome groupInput">
                        <CustomInput
                            type="text"
                            label="Nome do Fornecedor:"
                            id="nome"
                            name="nome"
                            maxLength={50}
                            value={form.nome}
                            onChange={(e) =>
                                handleChange('nome', e.target.value)
                            }
                        />
                        {errors.nome && (
                            <span className="invalid">{errors.nome}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="email"
                            label="Email:"
                            id="email"
                            name="email"
                            maxLength={50}
                            value={form.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            disabled={isFornSelected()}
                        />
                        {errors.email && (
                            <span className="invalid">{errors.email}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Telefone:"
                            id="telefone"
                            name="telefone"
                            mask="TEL"
                            minLength={15}
                            maxLength={15}
                            value={form.telefone}
                            onChange={(e) =>
                                handleChange('telefone', e.target.value)
                            }
                        />
                        {errors.telefone && (
                            <span className="invalid">{errors.telefone}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="CNPJ:"
                            id="cnpj"
                            name="cnpj"
                            mask="CNPJ"
                            minLength={18}
                            maxLength={18}
                            value={form.cnpj}
                            onChange={(e) =>
                                handleChange('cnpj', e.target.value)
                            }
                        />
                        {errors.cnpj && (
                            <span className="invalid">{errors.cnpj}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="CEP:"
                            id="cep"
                            name="cep"
                            mask="CEP"
                            maxLength={9}
                            value={form.endereco.cep}
                            onChange={(e) =>
                                handleChange('endereco', {
                                    ...form.endereco,
                                    cep: e.target.value,
                                })
                            }
                            disabled={isFornSelected()}
                        />
                        {errors.cep && (
                            <span className="invalid">{errors.cep}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Número do Logradouro:"
                            id="numeroLogradouro"
                            name="numeroLogradouro"
                            maxLength={6}
                            value={form.endereco.nLogradouro}
                            onChange={(e) =>
                                handleChange('endereco', {
                                    ...form.endereco,
                                    nLogradouro: e.target.value,
                                })
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
                            maxLength={20}
                            value={form.endereco.complemento}
                            onChange={(e) =>
                                handleChange('endereco', {
                                    ...form.endereco,
                                    complemento: e.target.value,
                                })
                            }
                        />
                        {errors.complemento && (
                            <span className="invalid">
                                {errors.complemento}
                            </span>
                        )}
                    </div>
                </div>
                <div className="containerButtons">
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isFornSelected()}
                    >
                        Adicionar
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={!isFornSelected()}
                    >
                        Atualizar
                    </button>
                    <button type="button" onClick={handleFornecedorListToggle}>
                        Mostrar Lista
                    </button>
                </div>
                <IoClose onClick={onClose} className="iconClose" />
            </div>
            {isFornecedorListOpen && (
                <UpdateFornModal
                    onSelect={selectFornecedor}
                    onClose={handleFornecedorListToggle}
                />
            )}
        </div>
    );
}
