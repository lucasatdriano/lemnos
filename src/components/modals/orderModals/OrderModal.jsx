/* eslint-disable react/prop-types */
import './orderModal.scss';
import { IoClose } from 'react-icons/io5';
import { formatDateToBr, formatPreco } from '../../../utils/formatters';

export default function OrderModal({ pedido, onClose }) {
    if (!pedido) {
        return null;
    }

    return (
        <div className="modal" onClick={onClose}>
            <div
                className="containerModalOrder"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Informações do Pedido</h2>
                <section className="sectionOrderModal">
                    <div className="containerDetailsOrder">
                        <h3 className="titleOrder">Detalhe do Pedido:</h3>
                        <div className="detailsTable">
                            <p className="labelDetails">Status do Pedido</p>
                            <p>{pedido.status}</p>

                            <p className="labelDetails">Forma de Pagamento</p>
                            <p>{pedido.metodoPagamento}</p>

                            <p className="labelDetails">
                                Quantidade de Produtos
                            </p>
                            <p>{pedido.qtdProdutos}</p>

                            <p className="labelDetails">Data do Pedido</p>
                            <p>{formatDateToBr(pedido.dataPedido)}</p>

                            <p className="labelDetails">Valor Pedido</p>
                            <p>{formatPreco(pedido.valorPedido)}</p>

                            <p className="labelDetails">Valor Frete</p>
                            <p>{formatPreco(pedido.valorFrete)}</p>

                            <p className="labelDetails">Valor Total</p>
                            <p>{formatPreco(pedido.valorPagamento)}</p>
                        </div>
                    </div>

                    <ul className="containerProductsOrder">
                        <h3 className="titleOrder">
                            {pedido.qtdProdutos === 1
                                ? 'Produto Comprado:'
                                : 'Produtos Comprados:'}
                        </h3>
                        {pedido.produtos &&
                            pedido.produtos.map((produto, index) => (
                                <li key={index} className="purchasedProducts">
                                    <div className="infosProduct">
                                        <img
                                            src={produto.imagemPrincipal}
                                            alt={produto.nome}
                                            className="imgProduct"
                                        />
                                        <div className="dataProduct">
                                            <h4 className="nameProduct">
                                                {produto.nome}
                                            </h4>
                                            <p>
                                                <strong>Marca:</strong>{' '}
                                                {produto.fabricante}
                                            </p>
                                            <p>
                                                <strong>Categoria:</strong>{' '}
                                                {produto.categoria}
                                            </p>
                                            <p>
                                                <strong>Cor:</strong>{' '}
                                                {produto.cor}
                                            </p>
                                            <p>
                                                <strong>
                                                    Quantidade Comprada:
                                                </strong>{' '}
                                                {produto.quantidade}
                                            </p>
                                        </div>
                                    </div>
                                    <h4 className="priceProduct">
                                        Preço:{' '}
                                        {formatPreco(produto.valorComDesconto)}
                                    </h4>
                                </li>
                            ))}
                    </ul>
                </section>
                <IoClose onClick={onClose} className="iconClose" />
            </div>
        </div>
    );
}
