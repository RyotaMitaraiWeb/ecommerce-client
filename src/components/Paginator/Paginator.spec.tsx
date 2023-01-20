import { act, fireEvent, render, screen } from '../../util/test-utils/test.utils';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Paginator } from './Paginator';

const router = createMemoryRouter([
    {
        path: '/',
        element: (
            <>
                <Paginator endpoint="all" total={16} />
                <h1>Test</h1>
            </>
        ),
    },
    {
        path: '/product/all',
        element: (
            <>
                <Paginator endpoint="all" total={16} />
                <h1>Search</h1>
            </>
        ),
    }
], {
    initialEntries: ['/'],
    initialIndex: 0,
});

describe('Paginator component', () => {
    beforeEach(() => {
        render(
            <>
                <RouterProvider router={router} />
            </>)
    });

    it('Displays three pages when the total amount of items is 16', () => {
        const page1 = screen.getByText(/1/);
        const page2 = screen.getByText(/2/);
        const page3 = screen.getByText(/3/);

        expect(page1).toBeInTheDocument();
        expect(page2).toBeInTheDocument();
        expect(page3).toBeInTheDocument();
    });
});