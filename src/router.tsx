import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';

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
            }
        ]
    }
]);