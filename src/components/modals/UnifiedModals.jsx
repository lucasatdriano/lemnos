import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FornecedorModal from './fornecedorModals/AddFornModal';
import FuncionarioModal from './funcionarioModals/AddFuncModal';
import ProdutoModal from './produtoModals/AddProductModal';
import ListFornModal from './fornecedorModals/ListFornModal';
import ListFuncModal from './funcionarioModals/ListFuncModal';
import ListProductModal from './produtoModals/ListProductModal';
import EnderecoModal from './enderecoModals/EnderecoModal';
import OrderModal from './orderModals/OrderModal';
import CompletedModal from './completedModal/CompletedModal';
import './modal.scss';

const UnifiedModals = ({
    openModalType,
    modalMode,
    onClose,
    externalSelectedItem,
    onSelectFromList,
    externalInicialCep,
    onSuccess,
}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMode, setCurrentMode] = useState(modalMode);
    const [currentType, setCurrentType] = useState(openModalType);

    useEffect(() => {
        if (!openModalType) {
            setSelectedItem(null);
            setCurrentMode(null);
            setCurrentType(null);
        }
    }, [openModalType]);

    useEffect(() => {
        setCurrentMode(modalMode);
        setCurrentType(openModalType);

        if (modalMode !== 'list') {
            setSelectedItem(null);
        }
    }, [modalMode, openModalType]);

    useEffect(() => {
        if (externalSelectedItem) {
            setSelectedItem(externalSelectedItem);
            if (modalMode !== 'view') {
                setCurrentMode('edit');
            }
        }
    }, [externalSelectedItem, modalMode]);

    const handleSelectFromList = (item) => {
        onClose();

        if (onSelectFromList) {
            onSelectFromList(currentType, item);
        } else {
            setSelectedItem(item);
            setCurrentMode('edit');
        }
    };

    const renderFormModal = () => {
        const commonProps = {
            onClose: onClose,
            onSuccess: onSuccess,
        };

        switch (currentType) {
            case 'fornecedor':
                return (
                    <FornecedorModal
                        {...commonProps}
                        tipoEntidade="fornecedor"
                        selectedFornecedor={
                            currentMode === 'edit' ? selectedItem : null
                        }
                    />
                );
            case 'funcionario':
                return (
                    <FuncionarioModal
                        {...commonProps}
                        tipoEntidade="funcionario"
                        selectedFuncionario={
                            currentMode === 'edit' ? selectedItem : null
                        }
                    />
                );
            case 'produto':
                return (
                    <ProdutoModal
                        {...commonProps}
                        selectedProduct={
                            currentMode === 'edit' ? selectedItem : null
                        }
                    />
                );
            case 'endereco':
                return (
                    <EnderecoModal
                        {...commonProps}
                        initialCep={externalInicialCep}
                    />
                );
            default:
                return null;
        }
    };

    const renderListModal = () => {
        const commonProps = {
            onClose: () => {
                onClose();
            },
            onSelect: handleSelectFromList,
        };

        switch (currentType) {
            case 'fornecedor':
                return <ListFornModal {...commonProps} />;
            case 'funcionario':
                return <ListFuncModal {...commonProps} />;
            case 'produto':
                return <ListProductModal {...commonProps} />;
            default:
                return null;
        }
    };

    const renderViewModal = () => {
        switch (currentType) {
            case 'pedido':
                return <OrderModal onClose={onClose} pedido={selectedItem} />;
            default:
                return null;
        }
    };

    const renderCompleteModal = () => {
        switch (currentType) {
            case 'completed':
                return <CompletedModal onClose={onClose} />;
            default:
                return null;
        }
    };

    if (!currentType) return null;

    if (currentMode === 'view') {
        return renderViewModal();
    }

    if (currentMode === 'complete') {
        return renderCompleteModal();
    }

    if (currentMode === 'list') {
        return renderListModal();
    }

    return renderFormModal();
};

UnifiedModals.propTypes = {
    openModalType: PropTypes.oneOf([
        'fornecedor',
        'funcionario',
        'produto',
        'endereco',
        'pedido',
        'completed',
    ]),
    modalMode: PropTypes.oneOf(['add', 'edit', 'list', 'view', 'complete']),
    onClose: PropTypes.func.isRequired,
    externalSelectedItem: PropTypes.object,
    onSelectFromList: PropTypes.func,
    externalInicialCep: PropTypes.string,
    onSuccess: PropTypes.func,
};

export default UnifiedModals;
