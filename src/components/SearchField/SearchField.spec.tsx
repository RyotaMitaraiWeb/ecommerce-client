import { fireEvent, render, screen } from '../../util/test-utils/test.utils';
import { Provider } from "react-redux";
import App from "../../App";
import { store } from "../../app/store";
import SearchField from "./SearchField";
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const router = createMemoryRouter([
    {
        path: '/',
        element: (
            <>
                <SearchField />
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

describe('Search field component', () => {
    beforeEach(() => {
        render(
            <>
                <RouterProvider router={router} />
            </>
        );
    })
    it('renders', () => {

        expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
    });

    it('Inputs successfully', () => {
        const searchEl = screen.getByLabelText(/Search/i);
        const buttonEl = screen.getByLabelText(/results/);
        expect(buttonEl).toBeInTheDocument();

        fireEvent.change(searchEl, { target: { value: 'test input' }});
        expect((searchEl as HTMLInputElement).value).toBe('test input');
    });

    it('Finds the button and clicks it successfully', () => {
        const buttonEl = screen.getByLabelText(/results/);
        fireEvent.click(buttonEl);

        expect(buttonEl).toBeInTheDocument();
    });
});