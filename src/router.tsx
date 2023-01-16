import { createBrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: 'about',
        element: <h1>About</h1>
    }
]);