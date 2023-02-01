import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { productRoutes } from './routes/product';
import { profileRoutes } from './routes/profile';
import { indexRoutes } from './routes';
import NotFound from '../../components/NotFound/NotFound';

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
            ...indexRoutes,
            profileRoutes,
            productRoutes,
            {
                path: '*',
                element: <NotFound />,
            }
        ],
    },
]);