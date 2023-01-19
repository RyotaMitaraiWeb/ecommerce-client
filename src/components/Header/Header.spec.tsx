import { Header } from "./Header";
import { render, screen } from '../../util/test-utils/test.utils';
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { store } from "../../app/store";
import { setUser } from "../../features/user/userSlice";
import Layout from '../../router';


const router = createMemoryRouter([
    {
        path: '/',
        element: (
            <>
                <Layout />
                <h1>Test</h1>
            </>
        )
    },
], {
    initialEntries: ['/'],
    initialIndex: 0,
});

describe('Header component', () => {
    beforeEach(() => {
        render(<RouterProvider router={router} />);
    });

    it('Finds a home link', () => {
        const home = screen.getByText(/Home/i);
        expect(home).toBeInTheDocument();
    });
});