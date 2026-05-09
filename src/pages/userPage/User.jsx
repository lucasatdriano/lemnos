/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MdLogout } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

import AuthService from '../../services/AuthService';
import { auth } from '../../services/configurations/FirebaseConfig';

import { getCliente, updateCliente } from '../../services/ClienteService';
import {
    getFuncionarioByToken,
    updateFuncionario,
} from '../../services/FuncionarioService';

import { excluirEndereco } from '../../services/EnderecoService';

import { setUserImg } from '../../store/actions/userActions';

import { formatCep, formatCpf } from '../../utils/formatters';

import UserImg from '../../assets/imgLemnos/imgUser.svg';

import ToolTip from '../../components/tooltip/ToolTip';
import CustomInput from '../../components/inputs/customInput/Inputs';

import EnderecoModal from './components/modals/EnderecoModal';
import HistoricoCompras from './components/order/Order';

import AddProdutoModal from './components/modals/admin/AddProductModal';
import AddFornecedorModal from './components/modals/admin/AddFornModal';
import AddFuncionarioModal from './components/modals/admin/AddFuncModal';

import './user.scss';

const User = ({ onLogout, userImg, setUserImg }) => {
    const navigate = useNavigate();

    const role = AuthService.getRole();

    const isCliente = role === 'ROLE_CLIENTE';
    const isAdmin = role === 'ROLE_ADMIN';

    const [username, setUsername] = useState('');

    const [view, setView] = useState('endereco');

    const [editing, setEditing] = useState(false);

    const [selectedEndereco, setSelectedEndereco] = useState(null);

    const [activeModal, setActiveModal] = useState(null);

    const [form, setForm] = useState({
        nome: '',
        email: '',
        cpf: '',
        enderecos: [],
    });

    useEffect(() => {
        fetchUsuario();

        const storedPhotoURL = localStorage.getItem('userImg');

        setUserImg(storedPhotoURL || UserImg);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        document
            .querySelector('html')
            ?.classList.toggle('modalOpen', !!activeModal);
    }, [activeModal]);

    async function fetchUsuario() {
        try {
            const usuario = isCliente
                ? await getCliente()
                : await getFuncionarioByToken();

            setForm({
                nome: usuario.nome,
                email: usuario.email,
                cpf: formatCpf(String(usuario.cpf)),
                enderecos:
                    usuario.enderecos?.map((endereco) => ({
                        cep: endereco.cep,
                        logradouro: endereco.logradouro,
                        estado: endereco.uf,
                        bairro: endereco.bairro,
                        cidade: endereco.cidade,
                        numero: endereco.numeroLogradouro,
                        complemento: endereco.complemento,
                    })) || [],
            });

            setUsername(usuario.nome.split(' ')[0]);

            if (AuthService.isLoggedInWithGoogle()) {
                const currentUser = auth.currentUser;

                if (
                    currentUser?.providerData.some(
                        (provider) => provider.providerId === 'google.com'
                    )
                ) {
                    const photoURL = currentUser.photoURL;

                    AuthService.setGoogleProfilePhoto(photoURL);

                    setUserImg(photoURL);
                }
            } else {
                setUserImg(AuthService.getGoogleProfilePhoto() || UserImg);
            }
        } catch (error) {
            console.error(error);

            AuthService.logout();

            navigate('/auth');
        }
    }

    function handleChange({ target }) {
        const { name, value } = target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'nome') {
            setUsername(value.split(' ')[0]);
        }
    }

    async function handleSaveChanges() {
        try {
            const usuario = {
                nome: form.nome,
                email: form.email,
            };

            if (isCliente) {
                await updateCliente(usuario);
            } else {
                await updateFuncionario(usuario);
            }

            setEditing(false);

            toast.success('Dados atualizados!');
        } catch (error) {
            toast.error('Erro ao atualizar dados');
        }
    }

    function openModal(modal) {
        setActiveModal(modal);
    }

    function closeModal() {
        setActiveModal(null);
    }

    function handleSelectEndereco(index) {
        setSelectedEndereco((prev) => (prev === index ? null : index));
    }

    async function handleDeleteEndereco() {
        if (selectedEndereco === null) {
            toast.warn('Nenhum endereço selecionado.');

            return;
        }

        try {
            const tokenList = AuthService.getToken().split('.');

            const json = JSON.parse(atob(tokenList[1]));

            const cep = form.enderecos[selectedEndereco]?.cep;

            const response = await excluirEndereco(json.sub, cep, role);

            if (!response) return;

            setForm((prev) => ({
                ...prev,
                enderecos: prev.enderecos.filter(
                    (_, index) => index !== selectedEndereco
                ),
            }));

            setSelectedEndereco(null);

            toast.success('Endereço apagado!');
        } catch (error) {
            console.error(error);

            toast.error('Erro ao apagar o endereço.');
        }
    }

    function renderEnderecos() {
        if (!form.enderecos.length) {
            return (
                <div className="allEnderecos">
                    <h3>Nenhum endereço cadastrado</h3>
                    <p>Adicione um endereço para facilitar suas compras!</p>
                    <button
                        type="button"
                        className="addEnderecoBtn"
                        onClick={() => openModal('endereco')}
                    >
                        Adicionar Endereço
                    </button>
                </div>
            );
        }

        return (
            <div className="allEnderecos">
                {form.enderecos.map((endereco, index) => (
                    <div
                        key={index}
                        className={`dataEnd ${
                            selectedEndereco === index ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectEndereco(index)}
                    >
                        <p>
                            <strong>Logradouro:</strong> {endereco.logradouro},{' '}
                            {endereco.numero}
                        </p>

                        {endereco.complemento && (
                            <p>
                                <strong>Complemento:</strong>{' '}
                                {endereco.complemento}
                            </p>
                        )}

                        <p>
                            <strong>CEP:</strong> {formatCep(endereco.cep)}
                        </p>

                        <p>
                            <strong>Cidade/Estado:</strong> {endereco.cidade} -{' '}
                            {endereco.estado}
                        </p>
                    </div>
                ))}

                <div className="buttons">
                    {selectedEndereco !== null && (
                        <button
                            type="button"
                            className="deleteEnderecoBtn"
                            onClick={handleDeleteEndereco}
                        >
                            Apagar Endereço
                        </button>
                    )}

                    {form.enderecos.length < 3 && (
                        <button
                            type="button"
                            className="addEnderecoBtn"
                            onClick={() => openModal('endereco')}
                        >
                            Adicionar Outro Endereço
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <section className="userContainer">
            <section>
                <div className="userData">
                    <div className="user">
                        <img src={userImg} alt="user" />

                        <h3>{username}</h3>
                    </div>

                    <div className="configUser">
                        <ToolTip message="Editar Perfil">
                            <FaRegEdit
                                className="icon"
                                onClick={() => setEditing(!editing)}
                            />
                        </ToolTip>

                        <ToolTip message="Sair da Conta">
                            <MdLogout className="icon" onClick={onLogout} />
                        </ToolTip>
                    </div>
                </div>

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
                            onChange={handleChange}
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
                        <div className="updateButtons">
                            <button
                                type="button"
                                disabled={!editing}
                                onClick={handleSaveChanges}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                {!isAdmin && (
                    <div className="selectBtn">
                        <button
                            type="button"
                            className={`btnView ${
                                view === 'endereco' ? 'selected' : ''
                            }`}
                            onClick={() => setView('endereco')}
                        >
                            Endereços
                        </button>

                        <button
                            type="button"
                            className={`btnView ${
                                view !== 'endereco' ? 'selected' : ''
                            }`}
                            onClick={() =>
                                setView(isCliente ? 'pedidos' : 'admin')
                            }
                        >
                            {isCliente ? 'Pedidos' : 'Administração'}
                        </button>
                    </div>
                )}

                {isAdmin ? (
                    <div className="adminPage">
                        <hr className="hrFuncionario" />

                        <button
                            type="button"
                            onClick={() => openModal('addProduto')}
                        >
                            Adicionar Produto
                        </button>

                        <button
                            type="button"
                            onClick={() => openModal('addFuncionario')}
                        >
                            Adicionar Funcionário
                        </button>

                        <button
                            type="button"
                            onClick={() => openModal('addFornecedor')}
                        >
                            Adicionar Fornecedor
                        </button>
                    </div>
                ) : view === 'endereco' ? (
                    renderEnderecos()
                ) : isCliente ? (
                    <div className="historyOrders">
                        <HistoricoCompras />
                    </div>
                ) : (
                    <>
                        <h2>Administrar Produtos</h2>

                        <button
                            type="button"
                            onClick={() => openModal('addProduto')}
                        >
                            Adicionar Produto
                        </button>

                        <button
                            type="button"
                            onClick={() => openModal('addFornecedor')}
                        >
                            Adicionar Fornecedor
                        </button>
                    </>
                )}
            </section>

            {activeModal === 'endereco' && (
                <EnderecoModal onClose={closeModal} />
            )}

            {activeModal === 'addProduto' && (
                <AddProdutoModal onClose={closeModal} />
            )}

            {activeModal === 'addFuncionario' && (
                <AddFuncionarioModal
                    tipoEntidade="funcionario"
                    onClose={closeModal}
                />
            )}

            {activeModal === 'addFornecedor' && (
                <AddFornecedorModal
                    tipoEntidade="fornecedor"
                    onClose={closeModal}
                />
            )}
        </section>
    );
};

const mapStateToProps = (state) => ({
    userImg: state.user.userImg,
});

export default connect(mapStateToProps, {
    setUserImg,
})(User);
