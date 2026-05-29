/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import CustomInput from '../../inputs/customInput/Inputs';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import {
    cadastrarEndereco,
    verificarCep,
    updateEndereco,
} from '../../../services/EnderecoService';
import {
    cadastrarFuncionario,
    updateFuncionario,
    toggleFuncionarioStatus,
} from '../../../services/FuncionarioService';
import PasswordToggle from '../../inputs/passwordToggle/PasswordToggle';
import InputError from '../../inputs/inputError/InputError';
import {
    formatCep,
    formatCpf,
    formatDate,
    formatDateToBr,
    formatTelefone,
} from '../../../utils/formatters';
import { validateFuncionario } from '../../../validations/funcionarioValidator';

export default function FuncionarioModal({
    onClose,
    tipoEntidade,
    selectedFuncionario,
}) {
    const initialFormState = {
        nome: '',
        cpf: '',
        dataNasc: '',
        dataAdmissao: '',
        telefone: '',
        email: '',
        senha: '',
        confPassword: '',
        endereco: {
            cep: '',
            numLogradouro: '',
            complemento: '',
        },
    };

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const [selectedFunc, setSelectedFunc] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const isFuncionarioAtivo = () => {
        return selectedFunc?.situacao === 'ATIVO';
    };

    useEffect(() => {
        if (selectedFuncionario && selectedFuncionario.email) {
            setForm({
                nome: selectedFuncionario.nome || '',
                cpf: formatCpf(selectedFuncionario.cpf?.toString() || '') || '',
                dataNasc: formatDate(selectedFuncionario.dataNascimento) || '',
                dataAdmissao:
                    formatDate(selectedFuncionario.dataAdmissao) || '',
                telefone:
                    formatTelefone(
                        selectedFuncionario.telefone?.toString() || ''
                    ) || '',
                email: selectedFuncionario.email || '',
                senha: '',
                confPassword: '',
                endereco:
                    selectedFuncionario.enderecos?.length > 0
                        ? {
                              cep:
                                  formatCep(
                                      selectedFuncionario.enderecos[0].cep?.toString() ||
                                          ''
                                  ) || '',
                              numLogradouro:
                                  selectedFuncionario.enderecos[0]
                                      .numeroLogradouro || '',
                              complemento:
                                  selectedFuncionario.enderecos[0]
                                      .complemento || '',
                          }
                        : { cep: '', numLogradouro: '', complemento: '' },
            });

            setSelectedFunc(selectedFuncionario);
            setIsEditMode(true);
            setErrors({});
        } else {
            setForm(initialFormState);
            setIsEditMode(false);
            setSelectedFunc(null);
        }
    }, [selectedFuncionario]);

    const handleChange = (name, value) => {
        if (name.startsWith('endereco.')) {
            const enderecoField = name.split('.')[1];
            setForm((prevForm) => ({
                ...prevForm,
                endereco: {
                    ...prevForm.endereco,
                    [enderecoField]: value,
                },
            }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFormSubmit = (form) => {
        return {
            ...form,
            nome: form.nome,
            cpf: String(form.cpf).replace(/\D/g, ''),
            telefone: String(form.telefone).replace(/\D/g, ''),
            dataNasc: formatDateToBr(form.dataNasc),
            dataAdmissao: formatDateToBr(form.dataAdmissao),
            endereco: {
                ...form.endereco,
                numLogradouro: form.endereco.numLogradouro
                    ? parseInt(form.endereco.numLogradouro)
                    : null,
                cep: form.endereco?.cep
                    ? String(form.endereco.cep).replace(/\D/g, '')
                    : '',
            },
        };
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateFuncionario(
            form,
            false
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const formattedForm = handleFormSubmit(form);
        delete formattedForm.confPassword;

        try {
            const isCepValue =
                formattedForm.endereco.cep &&
                formattedForm.endereco.cep.length > 0;

            if (isCepValue) {
                const cepValido = await verificarCep(
                    formattedForm.endereco.cep
                );
                if (!cepValido) {
                    toast.error('CEP não existente.');
                    return;
                }
            }

            let entidadeCadastrada = await cadastrarFuncionario(
                formattedForm,
                tipoEntidade
            );

            if (entidadeCadastrada) {
                const enderecoResponse = await cadastrarEndereco(
                    formattedForm.email,
                    formattedForm.endereco,
                    tipoEntidade
                );
                if (enderecoResponse) {
                    toast.success('Funcionário cadastrado com sucesso!');
                    setForm(initialFormState);
                    setErrors({});
                    setIsEditMode(false);
                    setSelectedFunc(null);
                    onClose();
                }
            }
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            toast.error(
                error.response?.data?.message ||
                    'Erro ao cadastrar funcionário.'
            );
        }
    };

    const handleToggleStatus = async () => {
        try {
            const success = await toggleFuncionarioStatus(form.email);

            if (success) {
                const acao = isFuncionarioAtivo() ? 'desativado' : 'ativado';
                toast.success(`Funcionário ${acao} com sucesso!`);
                setForm(initialFormState);
                setSelectedFunc(null);
                setIsEditMode(false);
                setErrors({});
                onClose();
            }
        } catch (error) {
            const acao = isFuncionarioAtivo() ? 'desativar' : 'ativar';
            toast.error(`Erro ao ${acao} funcionário.`);
            console.error(`Erro ao ${acao} funcionário:`, error);
        }
    };

    const handleUpdate = async () => {
        const { isValid, errors: validationErrors } = validateFuncionario(
            form,
            true
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const formattedForm = handleFormSubmit(form);
        delete formattedForm.confPassword;

        if (!formattedForm.password) {
            delete formattedForm.password;
        }

        try {
            const isCepValue =
                formattedForm.endereco.cep &&
                formattedForm.endereco.cep.length > 0;

            if (isCepValue) {
                const cepValido = await verificarCep(
                    formattedForm.endereco.cep
                );
                if (!cepValido) {
                    toast.error('CEP não existente.');
                    return;
                }
            }

            let entidadeAtualizada = await updateFuncionario(formattedForm);

            if (entidadeAtualizada === true) {
                let enderecoAtualizada = await updateEndereco(
                    formattedForm.email,
                    formattedForm.endereco,
                    tipoEntidade
                );

                if (enderecoAtualizada === true) {
                    toast.success('Funcionário atualizado com sucesso!');
                    setForm(initialFormState);
                    setSelectedFunc(null);
                    setIsEditMode(false);
                    setErrors({});
                    onClose();
                    return;
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            toast.error(
                error.response?.data?.message ||
                    'Erro ao atualizar funcionário.'
            );
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
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
                            ? 'Atualizar Funcionário'
                            : 'Adicionar Funcionário'}
                    </h2>
                </div>
                <div className="modalFuncionario">
                    <div className="inputNome funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="Nome do Funcionário:"
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

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="CPF:"
                            id="cpfInput"
                            name="cpf"
                            mask="CPF"
                            minLength={14}
                            maxLength={14}
                            value={form.cpf}
                            onChange={(e) =>
                                handleChange('cpf', e.target.value)
                            }
                            disabled={isEditMode}
                        />
                        <InputError error={errors.cpf} />
                    </div>

                    <div className="funcionarioFormField">
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

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="date"
                            label="Data de Nascimento:"
                            id="dataNasc"
                            name="dataNasc"
                            value={form.dataNasc}
                            onChange={(e) =>
                                handleChange('dataNasc', e.target.value)
                            }
                        />
                        <InputError error={errors.dataNasc} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="date"
                            label="Data de Admissão:"
                            id="dataAdmissao"
                            name="dataAdmissao"
                            value={form.dataAdmissao}
                            onChange={(e) =>
                                handleChange('dataAdmissao', e.target.value)
                            }
                        />
                        <InputError error={errors.dataAdmissao} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="Email:"
                            id="email"
                            name="email"
                            maxLength={40}
                            value={form.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            disabled={isEditMode}
                        />
                        <InputError error={errors.email} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="CEP:"
                            id="cep"
                            name="cep"
                            mask="CEP"
                            minLength={9}
                            maxLength={9}
                            value={form.endereco.cep}
                            onChange={(e) =>
                                handleChange('endereco.cep', e.target.value)
                            }
                            disabled={isEditMode}
                        />
                        <InputError error={errors.cep} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="Número do Logradouro:"
                            id="numeroLogradouro"
                            name="numeroLogradouro"
                            maxLength={6}
                            value={form.endereco.numLogradouro}
                            onChange={(e) =>
                                handleChange(
                                    'endereco.numLogradouro',
                                    e.target.value
                                )
                            }
                        />
                        <InputError error={errors.numLogradouro} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type="text"
                            label="Complemento:"
                            id="complemento"
                            name="complemento"
                            maxLength={20}
                            value={form.endereco.complemento}
                            onChange={(e) =>
                                handleChange(
                                    'endereco.complemento',
                                    e.target.value
                                )
                            }
                        />
                        <InputError error={errors.complemento} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type={showPassword ? 'text' : 'password'}
                            label="Senha:"
                            id="password"
                            name="password"
                            minLength={4}
                            maxLength={16}
                            value={form.senha}
                            onChange={(e) =>
                                handleChange('senha', e.target.value)
                            }
                        />
                        <PasswordToggle
                            visible={showPassword}
                            onToggle={togglePasswordVisibility}
                        />
                        <InputError error={errors.senha} />
                    </div>

                    <div className="funcionarioFormField">
                        <CustomInput
                            type={showConfPassword ? 'text' : 'password'}
                            label="Confirme sua Senha:"
                            id="confPassword"
                            name="confPassword"
                            minLength={4}
                            maxLength={16}
                            value={form.confPassword}
                            onChange={(e) =>
                                handleChange('confPassword', e.target.value)
                            }
                        />
                        <PasswordToggle
                            visible={showConfPassword}
                            onToggle={toggleConfPasswordVisibility}
                        />
                        <InputError error={errors.confPassword} />
                    </div>
                </div>
                <div className="containerButtons">
                    {isEditMode && (
                        <button type="button" onClick={handleToggleStatus}>
                            {isFuncionarioAtivo() ? 'Desativar' : 'Ativar'}
                        </button>
                    )}
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
