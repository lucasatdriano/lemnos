/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Select from 'react-select';
import CustomInput from '../../../../../components/inputs/customInput/Inputs';
import UpdateProductModal from './UpdateProductModal';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
    cadastrarProduto,
    getProdutoById,
    updateProduto,
} from '../../../../../services/ProdutoService';
import { getFornecedoresByNome } from '../../../../../services/FornecedorService';

const categorias = [
    'Casa Inteligente',
    'Computadores',
    'Eletrônicos',
    'Hardware',
    'Kits',
    'Monitores',
    'Notebooks e Portáteis',
    'Periféricos',
    'Realidade Virtual',
    'Redes e wireless',
    'Video Games',
    '',
];

const subcategoriasPorCategoria = {
    'Casa Inteligente': [
        'Assistente Virtual',
        'Controles Smarts',
        'Lâmpadas Inteligentes',
        'Sensores',
    ],
    Computadores: ['Computadores Gamers', 'Computadores Workstation'],
    Eletrônicos: [
        'Acessórios de Console',
        'Carregadores',
        'Refrigeração',
        'Smart Box',
    ],
    Hardware: [
        'Armazenamento',
        'Coolers',
        'Fonte',
        'Memória RAM',
        'Placa de Vídeo',
        'Placa Mãe',
        'Processadores',
    ],
    Kits: ['Gamer', 'Periféricos', 'Upgrade'],
    Monitores: ['Monitores Gamers', 'Monitores Workstation'],
    'Notebooks e Portáteis': ['Notebooks', 'Smartphones', 'Tablets'],
    Periféricos: [
        'Caixa de Som',
        'Fone de Ouvido',
        'Microfone',
        'Mouse',
        'Mousepad',
        'Teclado',
    ],
    'Realidade Virtual': ['Óculos de VR', 'Periféricos de VR'],
    'Redes e wireless': [
        'Access Point',
        'Adaptadores',
        'Cabos',
        'Cabos de Redes',
        'Roteadores',
        'Switches',
    ],
    'Video Games': ['Console de Mesa', 'Portátil'],
};

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

export default function ProdutoModal({ onClose }) {
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
        imagemPrinc: '',
        imagens: ['', '', ''],
    };
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProdutoListOpen, setIsProdutoListOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProdutoLoaded, setIsProdutoLoaded] = useState(false);
    const [subcategorias, setSubcategorias] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fornecedores, setFornecedores] = useState([]);
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);

    const handleChange = (name, value) => {
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...form.imagens];
        updatedImages[index] = value;
        setForm((prevForm) => ({
            ...prevForm,
            imagens: updatedImages,
        }));
    };

    const handleNumberChange = (name, value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            handleChange(name, value);
        }
    };

    const handleProdutoListToggle = () => {
        setForm(initialFormState);
        setIsProdutoListOpen(!isProdutoListOpen);
    };

    const selectProduto = async (produtos) => {
        try {
            const produto = await getProdutoById(produtos.id);
            if (!produto) {
                throw new Error('Dados do produto não encontrados.');
            }

            setForm({
                nome: produto.nome || '',
                descricao: produto.descricao || '',
                imagemPrincipal: produto.imagemPrincipal || '',
                imagens: produto.imagens || ['', '', ''],
                desconto: produto.desconto || '',
                cor: produto.cor || '',
                preco: produto.valorTotal || '',
                modelo: produto.modelo || '',
                peso: produto.peso || '',
                altura: produto.altura || '',
                comprimento: produto.comprimento || '',
                largura: produto.largura || '',
                fabricante: produto.fabricante || '',
                fornecedor: produto.fornecedor || '',
                categoria: produto.categoria || '',
                subCategoria: produto.subCategoria || '',
            });

            setSelectedFornecedor({
                value: produto.fornecedor,
                label: produto.fornecedor,
            });

            setSelectedProduct(produto);
            setIsProdutoLoaded(true);
            setIsProdutoListOpen(false);
        } catch (error) {
            console.error('Erro ao carregar dados do produto:', error);
            toast.error('Erro ao carregar dados do produto.', {
                position: "bottom-right"
            });
            throw error;
        }
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (isProductSelected()) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };
    const handleSubDropdownToggle = () => {
        setIsSubDropdownOpen(!isSubDropdownOpen);
        if (!isProductSelected()) {
            setIsSubDropdownOpen(!isSubDropdownOpen);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.nome) {
            newErrors.nome = 'O Nome do produto é obrigatório';
        }
        if (!form.descricao) {
            newErrors.descricao = 'A Descrição do produto é obrigatória';
        }
        if (!form.desconto) {
            newErrors.desconto = 'O Desconto do produto é obrigatório';
        }
        if (!form.cor) {
            newErrors.cor = 'A Cor do produto é obrigatória';
        }
        if (!form.preco) {
            newErrors.preco = 'O Preço do produto é obrigatório';
        }
        if (!form.modelo) {
            newErrors.modelo = 'O Modelo do produto é obrigatório';
        }
        if (!form.peso) {
            newErrors.peso = 'O Peso do produto é obrigatório';
        }
        if (!form.altura) {
            newErrors.altura = 'A Altura do produto é obrigatória';
        }
        if (!form.comprimento) {
            newErrors.comprimento = 'O Comprimento do produto é obrigatório';
        }
        if (!form.largura) {
            newErrors.largura = 'A Largura do produto é obrigatória';
        }
        if (!form.fabricante) {
            newErrors.fabricante = 'O Fabricante do produto é obrigatório';
        }
        if (!form.categoria) {
            newErrors.categoria = 'A Categoria do produto é obrigatória';
        }
        if (!form.subCategoria) {
            newErrors.subCategoria = 'A Subcategoria do produto é obrigatória';
        }
        if (!form.imagemPrincipal) {
            newErrors.imagemPrincipal =
                'A Imagem principal do produto é obrigatória';
        }
        if (!form.fornecedor) {
            newErrors.fornecedor = 'O Fornecedor do produto é obrigatório';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        if (validateForm()) {
            try {
                const formattedForm = {
                    ...form,
                    valor: parseFloat(form.preco),
                    desconto: parseFloat(form.desconto),
                    peso: parseFloat(form.peso),
                    altura: parseFloat(form.altura),
                    comprimento: parseFloat(form.comprimento),
                    largura: parseFloat(form.largura),
                    imagens: form.imagens.filter(Boolean),
                    fornecedor: selectedFornecedor
                        ? selectedFornecedor.value
                        : '',
                };
                await cadastrarProduto(formattedForm);

                toast.success('Produto cadastrado', {
                    position: "bottom-right"
                });
                setForm(initialFormState);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdate = async (e) => {
        if (!selectedProduct) return;

        try {
            if (validateForm()) {
                const formattedForm = {
                    ...form,
                    preco: parseFloat(form.preco),
                    desconto: parseFloat(form.desconto),
                    peso: parseFloat(form.peso),
                    altura: parseFloat(form.altura),
                    comprimento: parseFloat(form.comprimento),
                    largura: parseFloat(form.largura),
                    imagens: form.imagens.filter(Boolean),
                    fornecedor: selectedFornecedor
                        ? selectedFornecedor.value
                        : '',
                };
                try {
                    let entidadeAtualizada = await updateProduto(
                        formattedForm,
                        selectedProduct.id
                    );

                    if (entidadeAtualizada === true) {
                        toast.success('Produto atualizado.', {
                            position: "bottom-right"
                        });
                        setSelectedProduct(null);
                        setForm(initialFormState);
                        return;
                    }
                } catch (error) {
                    console.error('Erro ao atualizar produto:', error);
                    toast.error(error.response.data.message, {
                        position: "bottom-right"
                    });
                    throw error;
                }
            }
        } catch (error) {
            console.error('Erro na requisição de produto:', error);
            toast.error('Erro ao buscar produto.', {
                position: "bottom-right"
            });
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
        setSubcategorias(subcategoriasPorCategoria[option] || []);
        handleChange('subCategoria', '');
    };

    const isProductSelected = () => {
        return selectedProduct !== null;
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
        handleChange('fornecedor', selectedOption.value);

        try {
            const fornecedor = await getFornecedoresByNome(
                selectedOption.value
            );
            if (fornecedor) {
                handleChange('fornecedor', fornecedor || '');
            }
        } catch (error) {
            console.error('Erro ao buscar fornecedor:', error);
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
                <h2>Adicionar/Atualizar Produto</h2>
                <div className="modalProduto">
                    <div className="groupInput">
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
                        {errors.nome && (
                            <span className="invalid">{errors.nome}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Preço:"
                            id="preco"
                            name="preco"
                            maxLength={10}
                            mask="NUMBERS"
                            value={form.preco}
                            onChange={(e) =>
                                handleNumberChange('preco', e.target.value)
                            }
                        />
                        {errors.preco && (
                            <span className="invalid">{errors.preco}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                        {errors.descricao && (
                            <span className="invalid">{errors.descricao}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Desconto (%):"
                            id="desconto"
                            name="desconto"
                            maxLength={2}
                            mask="NUMBERS"
                            value={form.desconto}
                            onChange={(e) =>
                                handleChange('desconto', e.target.value)
                            }
                            disabled={!isProductSelected()}
                        />
                        {errors.desconto && (
                            <span className="invalid">{errors.desconto}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.cor && (
                            <span className="invalid">{errors.cor}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.modelo && (
                            <span className="invalid">{errors.modelo}</span>
                        )}
                    </div>

                    <div className="groupInput">
                        <CustomInput
                            type="text"
                            label="Imagem Principal:"
                            id="imagemPrinc"
                            name="imagemPrinc"
                            value={form.imagemPrinc}
                            onChange={(e) =>
                                handleChange('imagemPrinc', e.target.value)
                            }
                            disabled={isProductSelected()}
                        />
                        {errors.imagemPrinc && (
                            <span className="invalid">
                                {errors.imagemPrinc}
                            </span>
                        )}
                    </div>

                    {form.imagens.map((imagem, index) => (
                        <div className="groupInput" key={index}>
                            <CustomInput
                                type="text"
                                label={`Imagem ${index + 2}:`}
                                id={`imagem${index + 2}`}
                                name={`imagem${index + 2}`}
                                value={imagem}
                                onChange={(e) =>
                                    handleImageChange(index, e.target.value)
                                }
                                disabled={isProductSelected()}
                            />
                        </div>
                    ))}

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
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
                            options={categorias}
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
                        {errors.categoria && (
                            <span className="invalid">{errors.categoria}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
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
                        {errors.subCategoria && (
                            <span className="invalid">
                                {errors.subCategoria}
                            </span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.peso && (
                            <span className="invalid">{errors.peso}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.altura && (
                            <span className="invalid">{errors.altura}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.comprimento && (
                            <span className="invalid">
                                {errors.comprimento}
                            </span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.largura && (
                            <span className="invalid">{errors.largura}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                            disabled={isProductSelected()}
                        />
                        {errors.fabricante && (
                            <span className="invalid">{errors.fabricante}</span>
                        )}
                    </div>

                    <div className="groupInput">
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
                        {errors.fornecedor && (
                            <span className="invalid">{errors.fornecedor}</span>
                        )}
                    </div>
                </div>
                <div className="containerButtons">
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isProductSelected()}
                    >
                        Adicionar
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={!isProductSelected()}
                    >
                        Atualizar
                    </button>
                    <button type="button" onClick={handleProdutoListToggle}>
                        Mostrar Lista
                    </button>
                </div>
                <IoClose onClick={onClose} className="iconClose" />
            </div>
            {isProdutoListOpen && (
                <UpdateProductModal
                    onUpdate={handleUpdate}
                    onSelect={selectProduto}
                    onClose={handleProdutoListToggle}
                />
            )}
        </div>
    );
}
