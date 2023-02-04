import { createBrowserRouter, Outlet, useNavigation } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { productRoutes } from './routes/product';
import { profileRoutes } from './routes/profile';
import { indexRoutes } from './routes';
import NotFound from '../../components/NotFound/NotFound';
import Loader from '../../components/Loader/Loader';

export default function Layout() {
    const navigation = useNavigation();
    const loading = navigation.state === 'loading';
    return (
        <>
        {loading && <Loader />}
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