/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Select from 'react-select';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
    cadastrarProduto,
    updateProduto,
} from '../../../services/ProdutoService';
import { formatPrecoReal } from '../../../utils/formatters';
import { validateProduto } from '../../../validations/produtoValidator';
import { getFornecedoresByNome } from '../../../services/FornecedorService';
import InputError from '../../inputs/inputError/InputError';
import CustomInput from '../../inputs/customInput/Inputs';
import {
    CATEGORIES,
    SUBCATEGORIES_BY_CATEGORY,
} from '../../../constants/categories';

const Dropdown = ({ isOpen, options, onSelect, filterFunction }) => {
    const filteredOptions = filterFunction
        ? options.filter(filterFunction)
        : options;

    return (
        <div className={`dropdown ${isOpen ? 'open' : ''}`}>
            {isOpen &&
                filteredOptions.map((option, index) => (
                    <div
                        key={index}
                        className="dropdown-categoria"
                        onClick={() => onSelect(option)}
                    >
                        {option}
                    </div>
                ))}
        </div>
    );
};

export default function ProdutoModal({ onClose, selectedProduct }) {
    const initialFormState = {
        nome: '',
        preco: '',
        descricao: '',
        desconto: '0',
        cor: '',
        modelo: '',
        peso: '',
        altura: '',
        comprimento: '',
        largura: '',
        fabricante: '',
        fornecedor: '',
        categoria: '',
        subCategoria: '',
        imagemPrincipal: '',
        imagens: ['', '', ''],
    };

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [subcategorias, setSubcategorias] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fornecedores, setFornecedores] = useState([]);
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (selectedProduct && selectedProduct.id) {
            setForm({
                nome: selectedProduct.nome || '',
                descricao: selectedProduct.descricao || '',
                imagemPrincipal: selectedProduct.imagemPrincipal || '',
                imagens: selectedProduct.imagens || ['', '', ''],
                desconto: selectedProduct.desconto?.toString() || '0',
                cor: selectedProduct.cor || '',
                preco: formatPrecoReal(selectedProduct.valorTotal) || '',
                modelo: selectedProduct.modelo || '',
                peso: selectedProduct.peso?.toString() || '',
                altura: selectedProduct.altura?.toString() || '',
                comprimento: selectedProduct.comprimento?.toString() || '',
                largura: selectedProduct.largura?.toString() || '',
                fabricante: selectedProduct.fabricante || '',
                fornecedor: selectedProduct.fornecedor || '',
                categoria: selectedProduct.categoria || '',
                subCategoria: selectedProduct.subCategoria || '',
            });

            setSelectedFornecedor({
                value: selectedProduct.fornecedor,
                label: selectedProduct.fornecedor,
            });

            setIsEditMode(true);
            setErrors({});
        } else {
            setForm(initialFormState);
            setIsEditMode(false);
            setSelectedFornecedor(null);
        }
    }, [selectedProduct]);

    const handleChange = (name, value) => {
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...form.imagens];
        updatedImages[index] = value;
        setForm((prevForm) => ({
            ...prevForm,
            imagens: updatedImages,
        }));
        const errorKey = `imagem${index + 2}`;
        if (errors[errorKey]) {
            setErrors((prev) => ({ ...prev, [errorKey]: '' }));
        }
    };

    const handleNumberChange = (name, value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            handleChange(name, value);
        }
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSubDropdownToggle = () => {
        setIsSubDropdownOpen(!isSubDropdownOpen);
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateProduto(
            form,
            false
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formattedForm = {
                nome: form.nome,
                descricao: form.descricao,
                imagemPrincipal: form.imagemPrincipal,
                imagens: form.imagens.filter(Boolean),
                desconto: form.desconto,
                cor: form.cor,
                preco: form.preco,
                modelo: form.modelo,
                peso: parseFloat(form.peso) || 0,
                altura: parseFloat(form.altura) || 0,
                comprimento: parseFloat(form.comprimento) || 0,
                largura: parseFloat(form.largura) || 0,
                fabricante: form.fabricante,
                fornecedor: selectedFornecedor ? selectedFornecedor.value : '',
                categoria: form.categoria,
                subCategoria: form.subCategoria,
            };

            await cadastrarProduto(formattedForm);

            toast.success('Produto cadastrado com sucesso!');
            setForm(initialFormState);
            setErrors({});
            setIsEditMode(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || 'Erro ao cadastrar produto.'
            );
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedProduct?.id) {
            toast.error('Produto não selecionado para edição.');
            return;
        }

        const { isValid, errors: validationErrors } = validateProduto(
            form,
            true
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formattedForm = {
                nome: form.nome,
                descricao: form.descricao,
                imagemPrincipal: form.imagemPrincipal,
                imagens: form.imagens.filter(Boolean),
                desconto: form.desconto,
                cor: form.cor,
                preco: form.preco,
                modelo: form.modelo,
                peso: parseFloat(form.peso) || 0,
                altura: parseFloat(form.altura) || 0,
                comprimento: parseFloat(form.comprimento) || 0,
                largura: parseFloat(form.largura) || 0,
                fabricante: form.fabricante,
                fornecedor: selectedFornecedor ? selectedFornecedor.value : '',
                categoria: form.categoria,
                subCategoria: form.subCategoria,
            };

            let entidadeAtualizada = await updateProduto(
                formattedForm,
                selectedProduct.id
            );

            if (entidadeAtualizada === true) {
                toast.success('Produto atualizado com sucesso!');
                setForm(initialFormState);
                setErrors({});
                setIsEditMode(false);
                onClose();
                return;
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            toast.error(
                error.response?.data?.message || 'Erro ao atualizar produto.'
            );
        }
    };

    const handleSubCategoriaChange = (option) => {
        handleChange('subCategoria', option);
        setIsSubDropdownOpen(false);
    };

    const handleCategoriaChange = (option) => {
        setSelectedCategory(option);
        handleChange('categoria', option);
        setIsDropdownOpen(false);
        setIsSubDropdownOpen(true);
        setSubcategorias(SUBCATEGORIES_BY_CATEGORY[option] || []);
        handleChange('subCategoria', '');
    };

    const fetchFornecedores = async (nome) => {
        try {
            const fornecedores = await getFornecedoresByNome(nome);
            const fornecedorObject = fornecedores
                .slice(0, 5)
                .map((fornecedor) => ({
                    value: fornecedor.nome,
                    label: fornecedor.nome,
                }));
            setFornecedores(fornecedorObject);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (searchTerm) fetchFornecedores(searchTerm);
        else setFornecedores([]);
    }, [searchTerm]);

    const handleFornecedorChange = async (selectedOption) => {
        setSelectedFornecedor(selectedOption);
        handleChange('fornecedor', selectedOption?.value || '');
        if (errors.fornecedor) {
            setErrors((prev) => ({ ...prev, fornecedor: '' }));
        }
    };

    const handleInputChange = (fornecedor) => {
        if (!fornecedor) return '';
        setSearchTerm(fornecedor);
        return fornecedor;
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
                        {isEditMode ? 'Atualizar Produto' : 'Adicionar Produto'}
                    </h2>
                </div>
                <div className="modalProduto">
                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Nome do Produto:"
                            id="nome"
                            name="name"
                            maxLength={100}
                            value={form.nome}
                            onChange={(e) =>
                                handleChange('nome', e.target.value)
                            }
                        />
                        <InputError error={errors.nome} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Preço:"
                            id="preco"
                            name="preco"
                            maxLength={10}
                            mask="PRECO"
                            value={form.preco}
                            onChange={(e) =>
                                handleChange('preco', e.target.value)
                            }
                        />
                        <InputError error={errors.preco} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Descrição:"
                            id="descricao"
                            name="descricao"
                            minLength={5}
                            maxLength={200}
                            value={form.descricao}
                            onChange={(e) =>
                                handleChange('descricao', e.target.value)
                            }
                        />
                        <InputError error={errors.descricao} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Desconto (%):"
                            id="desconto"
                            name="desconto"
                            maxLength={3}
                            mask="NUMBERS"
                            value={form.desconto}
                            onChange={(e) =>
                                handleChange('desconto', e.target.value)
                            }
                        />
                        <InputError error={errors.desconto} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Cor:"
                            id="cor"
                            name="cor"
                            maxLength={30}
                            value={form.cor}
                            onChange={(e) =>
                                handleChange('cor', e.target.value)
                            }
                        />
                        <InputError error={errors.cor} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Modelo:"
                            id="modelo"
                            name="modelo"
                            maxLength={30}
                            value={form.modelo}
                            onChange={(e) =>
                                handleChange('modelo', e.target.value)
                            }
                        />
                        <InputError error={errors.modelo} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Imagem Principal:"
                            id="imagemPrincipal"
                            name="imagemPrincipal"
                            value={form.imagemPrincipal}
                            onChange={(e) =>
                                handleChange('imagemPrincipal', e.target.value)
                            }
                        />
                        <InputError error={errors.imagemPrincipal} />
                    </div>

                    {form.imagens.map((imagem, index) => (
                        <div className="produtoFormField" key={index}>
                            <CustomInput
                                type="text"
                                label={`Imagem ${index + 2}:`}
                                id={`imagem${index + 2}`}
                                name={`imagem${index + 2}`}
                                value={imagem}
                                onChange={(e) =>
                                    handleImageChange(index, e.target.value)
                                }
                            />
                            <InputError error={errors[`imagem${index + 2}`]} />
                        </div>
                    ))}

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Categoria:"
                            id="categoria"
                            name="categoria"
                            maxLength={30}
                            value={form.categoria}
                            onChange={(e) =>
                                handleChange('categoria', e.target.value)
                            }
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
                        <Dropdown
                            isOpen={isDropdownOpen}
                            options={CATEGORIES}
                            onSelect={(option) => {
                                handleCategoriaChange(option);
                                setIsDropdownOpen(false);
                                setIsSubDropdownOpen(true);
                            }}
                            filterFunction={(option) =>
                                option
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            }
                        />
                        <InputError error={errors.categoria} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Subcategoria:"
                            id="subCategoria"
                            name="subCategoria"
                            maxLength={30}
                            value={form.subCategoria}
                            onFocus={handleSubDropdownToggle}
                            onChange={() => {
                                setIsSubDropdownOpen(false);
                            }}
                        />
                        {isSubDropdownOpen ? (
                            <RiArrowDropUpLine
                                className="iconDrop"
                                onClick={handleSubDropdownToggle}
                            />
                        ) : (
                            <RiArrowDropDownLine
                                className="iconDrop"
                                onClick={handleSubDropdownToggle}
                            />
                        )}
                        <Dropdown
                            isOpen={isSubDropdownOpen}
                            options={subcategorias}
                            onSelect={(option) => {
                                handleSubCategoriaChange(option);
                                setIsSubDropdownOpen(false);
                            }}
                            filterFunction={(option) =>
                                option
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            }
                        />
                        <InputError error={errors.subCategoria} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Peso (kg):"
                            id="peso"
                            name="peso"
                            maxLength={6}
                            mask="NUMBERS"
                            value={form.peso}
                            onChange={(e) =>
                                handleNumberChange('peso', e.target.value)
                            }
                        />
                        <InputError error={errors.peso} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Altura (cm):"
                            id="altura"
                            name="altura"
                            maxLength={6}
                            mask="NUMBERS"
                            value={form.altura}
                            onChange={(e) =>
                                handleNumberChange('altura', e.target.value)
                            }
                        />
                        <InputError error={errors.altura} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Comprimento (cm):"
                            id="comprimento"
                            name="comprimento"
                            maxLength={6}
                            mask="NUMBERS"
                            value={form.comprimento}
                            onChange={(e) =>
                                handleNumberChange(
                                    'comprimento',
                                    e.target.value
                                )
                            }
                        />
                        <InputError error={errors.comprimento} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Largura (cm):"
                            id="largura"
                            name="largura"
                            maxLength={6}
                            mask="NUMBERS"
                            value={form.largura}
                            onChange={(e) =>
                                handleNumberChange('largura', e.target.value)
                            }
                        />
                        <InputError error={errors.largura} />
                    </div>

                    <div className="produtoFormField">
                        <CustomInput
                            type="text"
                            label="Fabricante:"
                            id="fabricante"
                            name="fabricante"
                            maxLength={50}
                            value={form.fabricante}
                            onChange={(e) =>
                                handleChange('fabricante', e.target.value)
                            }
                        />
                        <InputError error={errors.fabricante} />
                    </div>

                    <div className="produtoFormField">
                        <Select
                            value={selectedFornecedor}
                            options={fornecedores}
                            onChange={handleFornecedorChange}
                            onInputChange={handleInputChange}
                            isClearable
                            noOptionsMessage={() => ''}
                            placeholder="Selecione o fornecedor"
                            className="reactSelectContainer"
                            classNamePrefix="reactSelect"
                            menuPlacement="top"
                        />
                        <InputError error={errors.fornecedor} />
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
