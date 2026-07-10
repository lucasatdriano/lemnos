import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInput from '../../inputs/customInput/Inputs';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import {
    verificarCep,
    cadastrarEndereco,
    updateEndereco,
} from '../../../services/EnderecoService';
import {
    cadastrarFornecedor,
    updateFornecedor,
} from '../../../services/FornecedorService';
import InputError from '../../inputs/inputError/InputError';
import { formatCep, formatCnpj, formatPhone } from '../../../utils/formatters';
import { validateFornecedor } from '../../../validations/fornecedorValidator';

export default function FornecedorModal({
    onClose,
    tipoEntidade,
    selectedFornecedor,
}) {
    const initialFormState = useMemo(
        () => ({
            nome: '',
            email: '',
            telefone: '',
            cnpj: '',
            endereco: {
                cep: '',
                numeroLogradouro: '',
                complemento: '',
            },
        }),
        []
    );

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    const resetForm = useCallback(() => {
        setForm(initialFormState);
        setErrors({});
        setIsEditMode(false);
    }, [initialFormState]);

    const loadFornecedorData = useCallback(() => {
        if (selectedFornecedor && selectedFornecedor.email) {
            setForm({
                nome: selectedFornecedor.nome || '',
                cnpj:
                    formatCnpj(selectedFornecedor.cnpj?.toString() || '') || '',
                telefone:
                    formatPhone(
                        selectedFornecedor.telefone?.toString() || ''
                    ) || '',
                email: selectedFornecedor.email || '',
                endereco: {
                    cep: selectedFornecedor.endereco
                        ? formatCep(
                              selectedFornecedor.endereco.cep?.toString() || ''
                          ) || ''
                        : '',
                    numeroLogradouro: selectedFornecedor.endereco
                        ? selectedFornecedor.endereco.numeroLogradouro || ''
                        : '',
                    complemento: selectedFornecedor.endereco
                        ? selectedFornecedor.endereco.complemento || ''
                        : '',
                },
            });
            setIsEditMode(true);
            setErrors({});
        } else {
            setForm(initialFormState);
            setIsEditMode(false);
        }
    }, [selectedFornecedor, initialFormState]);

    useEffect(() => {
        loadFornecedorData();
    }, [loadFornecedorData]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleEnderecoChange = (field, value) => {
        setForm({
            ...form,
            endereco: {
                ...form.endereco,
                [field]: value,
            },
        });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateFornecedor(
            form,
            false
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const formattedForm = {
            ...form,
            nome: form.nome ? form.nome : '',
            cnpj: String(form.cnpj).replace(/\D/g, ''),
            telefone: String(form.telefone).replace(/\D/g, '').substring(0, 11),
            endereco: {
                ...form.endereco,
                cep:
                    form.endereco && form.endereco.cep
                        ? String(form.endereco.cep).replace(/\D/g, '')
                        : '',
                numeroLogradouro: form.endereco.numeroLogradouro
                    ? parseInt(form.endereco.numeroLogradouro)
                    : null,
            },
        };

        try {
            const cepValido = await verificarCep(formattedForm.endereco.cep);
            if (!cepValido) {
                toast.error('CEP não existente.');
                return;
            }

            const entidadeCadastrada = await cadastrarFornecedor(
                formattedForm,
                tipoEntidade
            );

            if (entidadeCadastrada) {
                await cadastrarEndereco(
                    formattedForm.email,
                    formattedForm.endereco,
                    tipoEntidade
                );
                toast.success('Fornecedor cadastrado com sucesso!');
                resetForm();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao cadastrar fornecedor:', error);
            toast.error(
                error.response?.data?.message || 'Erro ao cadastrar fornecedor.'
            );
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateFornecedor(
            form,
            true
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const formattedForm = {
            ...form,
            nome: form.nome ? form.nome : '',
            cnpj: String(form.cnpj).replace(/\D/g, ''),
            telefone: String(form.telefone).replace(/\D/g, '').substring(0, 11),
            endereco: {
                ...form.endereco,
                cep:
                    form.endereco && form.endereco.cep
                        ? String(form.endereco.cep).replace(/\D/g, '')
                        : '',
                numeroLogradouro: form.endereco.numeroLogradouro
                    ? parseInt(form.endereco.numeroLogradouro)
                    : null,
            },
        };

        try {
            const cepValido = await verificarCep(formattedForm.endereco.cep);
            if (!cepValido) {
                toast.error('CEP não existente.');
                return;
            }

            const entidadeAtualizada = await updateFornecedor(formattedForm);

            if (entidadeAtualizada === true) {
                let enderecoAtualizada = await updateEndereco(
                    formattedForm.email,
                    formattedForm.endereco,
                    tipoEntidade
                );

                if (enderecoAtualizada === true) {
                    toast.success('Fornecedor atualizado com sucesso!');
                    resetForm();
                    onClose();
                    return;
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            toast.error(
                error.response?.data?.message || 'Erro ao atualizar fornecedor.'
            );
        }
    };

    return (
        <div className="modal" onClick={onClose}>
            <div
                className="containerModal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="headerModal">
                    <IoClose onClick={onClose} className="iconClose" />
                    <h2>
                        {isEditMode
                            ? 'Atualizar Fornecedor'
                            : 'Adicionar Fornecedor'}
                    </h2>
                </div>

                <div className="modalFornecedor">
                    <div className="inputNome fornecedorFormField">
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
                        <InputError error={errors.nome} />
                    </div>

                    <div className="fornecedorFormField">
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
                            disabled={isEditMode}
                        />
                        <InputError error={errors.email} />
                    </div>

                    <div className="fornecedorFormField">
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
                        <InputError error={errors.telefone} />
                    </div>

                    <div className="fornecedorFormField">
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
                            disabled={isEditMode}
                        />
                        <InputError error={errors.cnpj} />
                    </div>

                    <div className="fornecedorFormField">
                        <CustomInput
                            type="text"
                            label="CEP:"
                            id="cep"
                            name="cep"
                            mask="CEP"
                            maxLength={9}
                            value={form.endereco.cep}
                            onChange={(e) =>
                                handleEnderecoChange('cep', e.target.value)
                            }
                            disabled={isEditMode}
                        />
                        <InputError error={errors.cep} />
                    </div>

                    <div className="fornecedorFormField">
                        <CustomInput
                            type="text"
                            label="Número do Logradouro:"
                            id="numeroLogradouro"
                            name="numeroLogradouro"
                            maxLength={6}
                            value={form.endereco.numeroLogradouro}
                            onChange={(e) =>
                                handleEnderecoChange(
                                    'numeroLogradouro',
                                    e.target.value
                                )
                            }
                        />
                        <InputError error={errors.numeroLogradouro} />
                    </div>

                    <div className="fornecedorFormField">
                        <CustomInput
                            type="text"
                            label="Complemento:"
                            id="complemento"
                            name="complemento"
                            maxLength={20}
                            value={form.endereco.complemento}
                            onChange={(e) =>
                                handleEnderecoChange(
                                    'complemento',
                                    e.target.value
                                )
                            }
                        />
                        <InputError error={errors.complemento} />
                    </div>
                </div>
                <div className="containerButtons">
                    <button
                        type="button"
                        onClick={isEditMode ? handleUpdate : handleAdd}
                    >
                        {isEditMode ? 'Atualizar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

FornecedorModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    tipoEntidade: PropTypes.string.isRequired,
    selectedFornecedor: PropTypes.object,
};
