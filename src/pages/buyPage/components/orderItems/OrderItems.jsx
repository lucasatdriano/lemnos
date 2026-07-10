import PropTypes from 'prop-types';
import { RiShoppingCartLine } from 'react-icons/ri';
import { formatCurrency } from '../../../../utils/formatters';
import './orderItems.scss';

export default function OrderItems({ carrinho }) {
    return (
        <div className="cart">
            <div className="titleContainers">
                <RiShoppingCartLine className="iconOrder" />
                <h3>Carrinho</h3>
            </div>

            <table className="dataProduct">
                <thead>
                    <tr>
                        <th colSpan={2}>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                    </tr>
                </thead>

                <tbody>
                    {carrinho.map((produto) => (
                        <tr key={produto.id}>
                            <td>
                                <img
                                    src={produto.imagemPrincipal}
                                    alt={produto.nome}
                                />
                            </td>

                            <td>
                                <p>{produto.nome}</p>
                            </td>

                            <td>{produto.qntdProduto}</td>

                            <td>
                                {formatCurrency(
                                    produto.valorComDesconto *
                                        produto.qntdProduto
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

OrderItems.propTypes = {
    carrinho: PropTypes.array.isRequired,
};
