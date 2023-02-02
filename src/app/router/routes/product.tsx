import { redirect, RouteObject } from "react-router";
import CreateProduct from "../../../components/Product/Create/CreateProduct";
import ProductDetails from "../../../components/Product/Details/ProductDetails";
import EditProduct from "../../../components/Product/Edit/EditProduct";
import Results from "../../../components/Results/Results";
import { openSnackbar } from "../../../features/snackbar/snackbarSlice";
import { IProductResults, IProductDetails, IError } from "../../../interfaces";
import { dispatchOutsideOfComponent } from "../../../util/dispatchOutsideOfComponent";
import { redirectViaStatus } from "../../../util/requests/redirect";
import { get, del, post } from "../../../util/requests/requests";
import { authGuard } from "../../guards/auth";
import { ownerGuard } from "../../guards/owner";

export const productRoutes: RouteObject = {
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
        },
        {
            path: ':id/buy',
            element: null,
            loader: async ({ params }) => {
                const id = params['id'];
                // data will be either an object with id of the deleted product or an array of errors
                // so just type it as an error object in this case
                const { res, data } = await post<IError[]>(`/product/${id}/buy`);
                if (!res.ok) {
                    dispatchOutsideOfComponent(openSnackbar, {
                        message: data[0].msg,
                        severity: 'error',
                    });

                    return redirectViaStatus(res.status, true);
                } else {
                    dispatchOutsideOfComponent(openSnackbar, {
                        message: 'Successful purchase!',
                        severity: 'success',
                    });

                    return redirect(`/product/${id}`);
                }
            },
        },
    ],
};