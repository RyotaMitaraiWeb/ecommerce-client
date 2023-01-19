import Navigation from './Navigation';
import { fireEvent, render, screen } from '../../util/test-utils/test.utils';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { store } from '../../app/store';
import { setUser } from '../../features/user/userSlice';
import { act } from 'react-dom/test-utils';

const router = createMemoryRouter([
    {
        path: '/',
        element: (
            <>
                <Navigation />
                <h1>Test</h1>
            </>
        )
    },
], {
    initialEntries: ['/'],
    initialIndex: 0,
});

describe('Navigation component', () => {
    beforeEach(() => {
        render(
            <RouterProvider router={router} />
        );
    });

    it('Displays register and login links when the user is not logged in', () => {
        const registerLink = screen.getByText(/Register/i);
        const loginLink = screen.getByText(/Login/i);

        expect(registerLink).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();
    });

    it('Displays new product, logout, and profile links when the user is logged in', () => {
        act(() => {
            store.dispatch(setUser({
                _id: '1',
                username: 'abcde',
                theme: 'light',
                palette: 'deepPurple',
            }));
        });

        const newProductLink = screen.getByText(/New product/i);
        const logoutLink = screen.getByText(/Logout/i);
        const profileLink = screen.getByText(/Profile/i);

        expect(newProductLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
        expect(profileLink).toBeInTheDocument();
    });
});