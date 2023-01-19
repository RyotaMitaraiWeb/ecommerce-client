import MobileMenuButton from './MobileMenuButton';
import { act, fireEvent, render, screen } from '../../util/test-utils/test.utils';
import MobileNavigationMenu from '../MobileNavigationMenu/MobileNavigationMenu';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const router = createMemoryRouter([
    {
        path: '/',
        element: (
            <>
                <MobileMenuButton />
                <MobileNavigationMenu />
                <h1>Test</h1>
            </>
        )
    },
    {
        path: '/product/search',
        element: <h1>Results</h1>,
    }
], {
    initialEntries: ['/'],
    initialIndex: 0,
});

describe('Mobile menu button component', () => {
    beforeEach(() => {
        render(
            <>
                <RouterProvider router={router} />
            </>)
    });

    it('renders', () => {
        const buttonEl = screen.getByLabelText(/Open mobile menu/i);
        expect(buttonEl).toBeInTheDocument();
    });

    it('opens the mobile navigation menu when clicked', () => {
        const buttonEl = screen.getByLabelText(/Open mobile menu/i);
        act(() => {
            fireEvent.click(buttonEl);
        });

        const home = screen.getByText(/Home/i);
        expect(home).toBeInTheDocument();
    });
});