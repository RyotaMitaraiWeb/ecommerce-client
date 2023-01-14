import { Box, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useState, useMemo } from 'react';
import './App.scss';
import { palette, themes } from './themes';

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
            }
        }), [mode, palette]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
        </ThemeProvider>
    );
}

export default App;
