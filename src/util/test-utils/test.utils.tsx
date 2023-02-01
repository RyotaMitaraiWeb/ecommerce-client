import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Router, RouterProvider } from "react-router-dom";
import App from "../../App";
import { store } from "../../app/store";
import { router } from "../../app/router/router";


const allProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: allProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }