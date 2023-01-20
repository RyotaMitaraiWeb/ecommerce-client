import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import Results from './components/Results/Results';
import { IProductResults } from './interfaces';
import { get } from './util/requests/requests';

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

                            const { data } = await get('/product/all' + params);
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
                    }
                ]
            }
        ]
    }
]);