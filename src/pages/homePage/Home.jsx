import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProdutosFiltrados } from '../../services/UsuarioProdutoService';
import Slide from './components/carousel/Carousel';
import BrandsList from './components/BrandsList';
import OfferList from '../../components/layout/lists/OfferList';
import kits from '../../assets/deps/imgKitUpgrade.svg';
import videoGame from '../../assets/deps/imgVideoGame.svg';
import monitor from '../../assets/deps/imgMonitor.svg';
import computador from '../../assets/deps/imgPcGamer.svg';
import portatil from '../../assets/deps/imgNotebookPortatil.svg';
import perifericos from '../../assets/deps/imgPerifericos.svg';
import CardProduct from '../../components/cards/cardProduct/CardProduct';
import './home.scss';

export default function Home() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function fetchProdutos() {
            const filtro = {
                categoria: '',
                subCategoria: '',
                marca: '',
                menorPreco: 0,
                maiorPreco: 50000,
            };

            const data = await listarProdutosFiltrados(filtro, 3, 20);
            setProdutos(data);
        }

        fetchProdutos();
    }, []);

    const handleDepartmentClick = (category) => {
        localStorage.setItem('category', category);
        localStorage.removeItem('subCategory');
        localStorage.removeItem('searchTerm');
        localStorage.removeItem('brand');
        localStorage.removeItem('evaluation');
        localStorage.removeItem('minPrice');
        localStorage.removeItem('maxPrice');
    };

    return (
        <>
            <main>
                <Slide />

                <section className="brands">
                    <h2 className="subTitle">Principais Marcas</h2>
                    <BrandsList />
                </section>

                <section className="mainDep">
                    <h2 className="subTitle">Principais Departamentos</h2>

                    <div className="containerDeps">
                        <Link
                            to="/productFilter/Computadores"
                            className="gridItem item1"
                            onClick={() =>
                                handleDepartmentClick('Computadores')
                            }
                        >
                            <img
                                src={computador}
                                alt="imagem filtro computadores"
                            />
                            <h3>Computadores</h3>
                        </Link>

                        <Link
                            to="/productFilter/Notebooks e Portáteis"
                            className="gridItem item2"
                            onClick={() =>
                                handleDepartmentClick('Notebooks e Portáteis')
                            }
                        >
                            <img
                                src={portatil}
                                alt="imagem filtro notebook e portáteis"
                            />
                            <h3>Notebook e Portáteis</h3>
                        </Link>

                        <Link
                            to="/productFilter/Kits"
                            className="gridItem item3"
                            onClick={() => handleDepartmentClick('Kits')}
                        >
                            <img src={kits} alt="imagem filtro kits" />
                            <h3>Kits</h3>
                        </Link>

                        <Link
                            to="/productFilter/Periféricos"
                            className="gridItem item4"
                            onClick={() => handleDepartmentClick('Periféricos')}
                        >
                            <img
                                src={perifericos}
                                alt="imagem filtro periféricos"
                            />
                            <h3>Periféricos</h3>
                        </Link>

                        <Link
                            to="/productFilter/Monitores"
                            className="gridItem item5"
                            onClick={() => handleDepartmentClick('Monitores')}
                        >
                            <img src={monitor} alt="imagem filtro monitores" />
                            <h3>Monitores</h3>
                        </Link>

                        <Link
                            to="/productFilter/Video Games"
                            className="gridItem item6"
                            onClick={() => handleDepartmentClick('Video Games')}
                        >
                            <img
                                src={videoGame}
                                alt="imagem filtro video games"
                            />
                            <h3>Video Games</h3>
                        </Link>
                    </div>
                </section>

                <h2 className="subTitle">Ofertas</h2>
                <section className="offers">
                    <OfferList onlyOnSale />
                </section>

                <section className="mainProds">
                    <h2 className="subTitle">Principais Produtos</h2>
                    <div className="productsList">
                        {produtos.map((produto) => (
                            <CardProduct key={produto.id} produto={produto} />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
