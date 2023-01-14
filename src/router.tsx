import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <h1>Hello</h1>
    },
    {
        path: 'about',
        element: <h1>About</h1>
    }
]);