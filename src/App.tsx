import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import { Link, LinkProps, RouterProvider } from 'react-router-dom';
import './App.scss';
import { useAppDispatch, useAppSelector } from './app/hooks';
import SnackbarAlert from './features/snackbar/Snackbar';
import { IUserState, setUser } from './features/user/userSlice';
import { router } from './app/router/router';
import { palette, themes } from './themes';
import { get } from './util/requests/requests';

const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <Link ref={ref} to={href} {...other} />;
});

function App() {
    const mode = useAppSelector(state => state.user.theme);
    const palette = useAppSelector(state => state.user.palette);
    console.log(palette);

    const dispatch = useAppDispatch();

    const theme = useMemo(() => {
        console.log('recalculate');
        
        return createTheme({
            palette: {
                mode,
                primary: {
                    main: themes[palette as palette]
                },
                secondary: {
                    main: '#a2cf6e',
                },
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        LinkComponent: LinkBehavior,
                    },
                },
            }
        }
        )
    }, [mode, palette]
    );


    useEffect(() => {
        async function authenticateUser() {
            const { res, data } = await get<IUserState>('/user');
            if (res.ok) {
                dispatch(setUser(data));
                console.log(data);

            } else {
                localStorage.removeItem('accessToken');
            }
        }

        authenticateUser();
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
            <SnackbarAlert />
        </ThemeProvider>
    );
}

export default App;
