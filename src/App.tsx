import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React from 'react';
import { useState, useMemo } from 'react';
import { Link, LinkProps, RouterProvider } from 'react-router-dom';
import './App.scss';
import SnackbarAlert from './features/snackbar/Snackbar';
import { router } from './router';
import { palette, themes } from './themes';

const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <Link ref={ref} to={href} {...other} />;
});

function App() {
    const [mode, setMode] = useState<PaletteMode>('dark');
    const [palette, setPalette] = useState<palette>('deepPurple');

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode,
                primary: {
                    main: themes[palette]
                }
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        LinkComponent: LinkBehavior,
                    },
                }
            }
        }
        ), [mode, palette]
    );


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
            <SnackbarAlert />
        </ThemeProvider>
    );
}

export default App;
