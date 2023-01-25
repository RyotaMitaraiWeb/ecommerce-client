import { createBrowserRouter, Outlet, redirect } from 'react-router-dom';
import { authGuard } from './app/guards/auth';
import { guestGuard } from './app/guards/guest';
import { ownerGuard } from './app/guards/owner';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import CreateProduct from './components/Product/Create/CreateProduct';
import ProductDetails from './components/Product/Details/ProductDetails';
import EditProduct from './components/Product/Edit/EditProduct';
import Results from './components/Results/Results';
import { ISnackbar, openSnackbar } from './features/snackbar/snackbarSlice';
import { resetUser } from './features/user/userSlice';
import { IError, IProductDetails, IProductResults } from './interfaces';
import { dispatchOutsideOfComponent } from './util/dispatchOutsideOfComponent';
import { redirectViaStatus } from './util/requests/redirect';
import { del, get } from './util/requests/requests';

export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
                index: true,
            },
            {
                path: 'about',
                element: <h1>About</h1>
            },
            {
                path: 'login',
                element: <Login />,
                loader: guestGuard,
            },
            {
                path: 'register',
                element: <Register />,
                loader: guestGuard,

            },
            {
                path: 'logout',
                element: null,
                loader: async () => {
                    const { res, data } = await del('/user/logout');
                    if (res.ok) {
                        dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
                            severity: 'success',
                            message: 'Successfully logged out!',
                        });

                        dispatchOutsideOfComponent(resetUser);

                        localStorage.removeItem('accessToken');
                        return redirect('/');
                    } else {
                        dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
                            severity: 'error',
                            message: 'You must be logged in to perform this action!',
                        });

                        return redirectViaStatus(res.status, true);
                    }
                }
            },
            {
                path: 'product',
                children: [
                    {
                        path: 'all',
                        loader: async ({ request }) => {
                            const url = new URL(request.url);
                            const page = url.searchParams.get('page');
                            const sort = url.searchParams.get('sort');
                            const by = url.searchParams.get('by');

                            if (!page) {
                                url.searchParams.append('page', '1');
                            }

                            if (!sort || !by) {
                                url.searchParams.append('sort', 'asc');
                                url.searchParams.append('by', 'name');
                            }

                            const params = url.search;

                            const { data } = await get<IProductResults>('/product/all' + params);
                            return data;
                        },
                        element: <Results endpoint="all" />
                    },
                    {
                        path: 'search',
                        loader: async ({ request }) => {
                            const url = new URL(request.url);
                            const page = url.searchParams.get('page');
                            const sort = url.searchParams.get('sort');
                            const by = url.searchParams.get('by');

                            if (!page) {
                                url.searchParams.append('page', '1');
                            }

                            if (!sort || !by) {
                                url.searchParams.append('sort', 'asc');
                                url.searchParams.append('by', 'name');
                            }

                            const search = url.search;

                            const { data } = await get('/product/search' + search);
                            return data;
                        },
                        element: <Results endpoint="search" />
                    },
                    {
                        path: 'create',
                        element: <CreateProduct />,
                        loader: authGuard,
                    },
                    {
                        path: ':id',
                        element: <ProductDetails />,
                        loader: async ({ params }) => {
                            const id = params['id'];
                            const { res, data } = await get<IProductDetails>(`/product/${id}`);
                            return redirectViaStatus(res.status) || data;
                        },
                        children: [
                            {
                                path: 'delete',
                                element: null,
                                loader: async ({ params }) => {
                                    const id = params['id'];
                                    // data will be either an object with id of the deleted product or an array of errors
                                    // so just type it as an error object in this case
                                    const { res, data } = await del<IError[]>(`/product/${id}`);
                                    if (!res.ok) {
                                        dispatchOutsideOfComponent(openSnackbar, {
                                            message: data[0].msg,
                                            severity: 'error',
                                        });

                                        return redirectViaStatus(res.status, true);
                                    } else {
                                        dispatchOutsideOfComponent(openSnackbar, {
                                            message: 'Deleted the product successfully!',
                                            severity: 'success',
                                        });

                                        return redirect('/');
                                    }
                                },
                            },
                        ]
                    },
                    {
                        path: ':id/edit',
                        element: <EditProduct />,
                        loader: ownerGuard,
                    }
                ]
            }
        ]
    }
]);