import { lazy, Suspense } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import Loading from './components/layout/loading/Loading';

const Home = lazy(() => import('./pages/homePage/Home'));
const About = lazy(() => import('./pages/aboutPage/About'));
const Auth = lazy(() => import('./pages/authPage/Auth'));
const Product = lazy(() => import('./pages/productPage/Product'));
const ProductFilter = lazy(
    () => import('./pages/productFilterPage/ProductFilter')
);
const Cart = lazy(() => import('./pages/cartPage/Cart'));
const BuyPage = lazy(() => import('./pages/buyPage/Buy'));
const PaymentPage = lazy(() => import('./pages/paymentPage/Payment'));
const NotFound = lazy(() => import('./pages/notFoundPage/NotFound'));

export default function AnimatedRoutes() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { isNavigatingToPayment } = useNavigation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.pathname}
                classNames="fade"
                timeout={300}
            >
                <Suspense fallback={<Loading />}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />

                        <Route path="/product/:id" element={<Product />} />

                        <Route
                            path="/productFilter/:category"
                            element={<ProductFilter />}
                        />

                        <Route
                            path="/productFilter"
                            element={<ProductFilter />}
                        />

                        <Route path="/about" element={<About />} />

                        <Route path="/auth" element={<Auth />} />

                        <Route path="/cart" element={<Cart />} />

                        <Route
                            path="/buy"
                            element={
                                isAuthenticated || isNavigatingToPayment ? (
                                    <BuyPage />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/payment"
                            element={
                                isAuthenticated || isNavigatingToPayment ? (
                                    <PaymentPage />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </CSSTransition>
        </TransitionGroup>
    );
}
