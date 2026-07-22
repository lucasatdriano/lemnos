import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { formatCurrency } from '../../../../utils/formatters';
import {
    adicionarProdutoCarrinho,
    removerProdutoCarrinho,
} from '../../../../services/UsuarioProdutoService';
import './cartCard.scss';

export default function CartCard({ produto }) {
    const navigate = useNavigate();

    const handleNavigate = (produtoId) => {
        navigate(`/product/${produtoId}`);
    };

    const handleDecreaseQuantity = async (produtoId) => {
        try {
            await removerProdutoCarrinho({ id: produtoId }, 1);
        } catch (error) {
            console.error('Erro ao diminuir produto do carrinho:', error);
        }
    };

    const handleIncreaseQuantity = async (produtoId) => {
        try {
            await adicionarProdutoCarrinho({ id: produtoId }, 1);
        } catch (error) {
            console.error('Erro ao aumentar quantidade do produto:', error);
        }
    };

    const handleRemoveItem = async (produtoId, produto) => {
        try {
            await removerProdutoCarrinho(
                { id: produtoId },
                produto.qntdProduto
            );
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error);
        }
    };

    return (
        <li className="cartCard">
            <div className="labels">
                <p>Produto</p>
                <p>Quantidade</p>
                <p>Valor</p>
            </div>

            <div className="productDesc">
                <img
                    src={produto.imagemPrincipal}
                    alt={produto.nome}
                    onClick={() => handleNavigate(produto.id)}
                />

                <h4
                    className="nameProduct"
                    onClick={() => handleNavigate(produto.id)}
                >
                    {produto.nome}
                </h4>

                <p className="amount">
                    <button
                        type="button"
                        className="buttonQtd"
                        onClick={() => handleDecreaseQuantity(produto.id)}
                        aria-label={`Diminuir quantidade de ${produto.nome}`}
                        title={`Diminuir quantidade de ${produto.nome}`}
                    >
                        <FaMinus aria-hidden="true" />
                    </button>

                    <span id="qtdNumber" aria-live="polite">
                        {produto.qntdProduto}
                    </span>

                    <button
                        type="button"
                        className="buttonQtd"
                        onClick={() => handleIncreaseQuantity(produto.id)}
                        aria-label={`Aumentar quantidade de ${produto.nome}`}
                        title={`Aumentar quantidade de ${produto.nome}`}
                    >
                        <FaPlus aria-hidden="true" />
                    </button>
                </p>

                <p className="priceProduct">
                    {formatCurrency(
                        produto.qntdProduto * produto.valorComDesconto
                    )}
                </p>

                <p>
                    <button
                        className="btnRemove"
                        onClick={() => handleRemoveItem(produto.id, produto)}
                        aria-label={`Remover ${produto.nome} do carrinho`}
                        title={`Remover ${produto.nome} do carrinho`}
                    >
                        <TiDeleteOutline aria-hidden="true" />
                    </button>
                </p>
            </div>
        </li>
    );
}

CartCard.propTypes = {
    produto: PropTypes.object.isRequired,
};
