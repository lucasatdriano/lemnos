import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import AuthService from '../../services/AuthService';
import { auth } from '../../services/configurations/FirebaseConfig';

import { getCliente, updateCliente } from '../../services/ClienteService';
import {
    getFuncionarioByToken,
    updateFuncionario,
} from '../../services/FuncionarioService';
import { excluirEndereco } from '../../services/EnderecoService';
import { setUserImg } from '../../store/slices/userSlice';
import { formatCpf } from '../../utils/formatters';
import UserImg from '../../assets/imgLemnos/imgUser.svg';
import OrderHistoryList from './components/orderHistory/OrderHistoryList';
import UnifiedModals from '../../components/modals/UnifiedModals';
import UserProfileHeader from './components/profile/UserProfileHeader';
import UserProfileForm from './components/profile/UserProfileForm';
import UserNavigation from './components/navigation/UserNavigation';
import AdminSection from './components/admin/AdminSection';
import AddressList from './components/address/AddressList';
import './user.scss';

const User = ({ onLogout, userImg, setUserImg }) => {
    const navigate = useNavigate();

    const role = AuthService.getRole();
    const isCliente = role === 'ROLE_CLIENTE';
    const isAdmin = role === 'ROLE_ADMIN';

    const [username, setUsername] = useState('');

    const [view, setView] = useState(isAdmin ? 'fornecedores' : 'endereco');
    const [editing, setEditing] = useState(false);
    const [selectedEndereco, setSelectedEndereco] = useState(null);

    const [modalState, setModalState] = useState({
        type: null,
        mode: null,
        item: null,
    });

    const [form, setForm] = useState({
        nome: '',
        email: '',
        cpf: '',
        enderecos: [],
    });

    const fetchUsuario = useCallback(async () => {
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
    }, [isCliente, navigate, setUserImg]);

    useEffect(() => {
        fetchUsuario();

        const storedPhotoURL = localStorage.getItem('userImg');

        setUserImg(storedPhotoURL || UserImg);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeAllModals();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [fetchUsuario, setUserImg]);

    useEffect(() => {
        document
            .querySelector('html')
            ?.classList.toggle('modalOpen', !!modalState.type);
    }, [modalState.type]);

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

    const openModal = (type, mode, item = null, onSuccess = null) => {
        setModalState({ type, mode, item, onSuccess });
    };

    const closeAllModals = () => {
        setModalState({ type: null, mode: null, item: null, onSuccess: null });
    };

    const handleSelectFromList = (type, item) => {
        setModalState({ type, mode: 'edit', item });
    };

    const openPedidoModal = (pedido) => {
        setModalState({ type: 'pedido', mode: 'view', item: pedido });
    };

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

    return (
        <section className="userContainer">
            <div className="userContent">
                <UserProfileHeader
                    userImg={userImg}
                    username={username}
                    editing={editing}
                    onToggleEdit={() => setEditing(!editing)}
                    onLogout={onLogout}
                />

                <UserProfileForm
                    form={form}
                    editing={editing}
                    onChange={handleChange}
                    onSave={handleSaveChanges}
                />
            </div>

            <div className="userContent">
                <UserNavigation
                    view={view}
                    setView={setView}
                    isAdmin={isAdmin}
                    isCliente={isCliente}
                />

                {view === 'endereco' ? (
                    <AddressList
                        enderecos={form.enderecos}
                        selectedEndereco={selectedEndereco}
                        onSelectEndereco={handleSelectEndereco}
                        onDeleteEndereco={handleDeleteEndereco}
                        onAddEndereco={() => openModal('endereco', 'add')}
                        isCliente={isCliente}
                    />
                ) : isCliente ? (
                    <OrderHistoryList onOpenPedidoModal={openPedidoModal} />
                ) : view === 'produtos' ? (
                    <AdminSection
                        title="Gerenciar Produtos"
                        description="Gerenciamento de produtos (Adicione, Visualize, Edite ou Remova)."
                        addLabel="Adicionar Produto"
                        listLabel="Ver Lista de Produtos"
                        onAdd={() => openModal('produto', 'add')}
                        onList={() => openModal('produto', 'list')}
                    />
                ) : view === 'fornecedores' ? (
                    <AdminSection
                        title="Gerenciar Fornecedores"
                        description="Cadastre os fornecedores para vincular aos seus produtos."
                        addLabel="Adicionar Fornecedor"
                        listLabel="Ver Lista de Fornecedores"
                        onAdd={() => openModal('fornecedor', 'add')}
                        onList={() => openModal('fornecedor', 'list')}
                    />
                ) : view === 'funcionarios' && isAdmin ? (
                    <AdminSection
                        title="Gerenciar Funcionários"
                        description="Gerenciamento de funcionários (Adicione, Visualize, Edite ou Desative)."
                        addLabel="Adicionar Funcionário"
                        listLabel="Ver Lista de Funcionários"
                        onAdd={() => openModal('funcionario', 'add')}
                        onList={() => openModal('funcionario', 'list')}
                    />
                ) : null}
            </div>

            {modalState.type && (
                <UnifiedModals
                    openModalType={modalState.type}
                    modalMode={modalState.mode}
                    onClose={closeAllModals}
                    externalSelectedItem={modalState.item}
                    onSelectFromList={handleSelectFromList}
                    onSuccess={modalState.onSuccess || fetchUsuario}
                />
            )}
        </section>
    );
};

User.propTypes = {
    onLogout: PropTypes.func.isRequired,
    userImg: PropTypes.string,
    setUserImg: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    userImg: state.user.userImg,
});

const ConnectedUser = connect(mapStateToProps, {
    setUserImg,
})(User);

export default ConnectedUser;
