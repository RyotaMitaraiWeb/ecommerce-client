import { PaletteMode } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { palette } from '../../themes';

export interface IUserState {
    _id: string;
    username: string;
    palette: palette;
    theme: PaletteMode;
}

const initialState: IUserState = {
    _id: '',
    username: '',
    palette: 'deepPurple',
    theme: 'light',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state._id = action.payload._id;
            state.username = action.payload.username;
            state.palette = action.payload.palette;
            state.theme = action.payload.theme;
        },
        resetUser: (state) => {
            state._id = '';
            state.username = '';
            state.palette = 'deepPurple';
            state.theme = 'light';
        },
        setPalette: (state, action: PayloadAction<{ palette: palette }>) => {
            state.palette = action.payload.palette;
        },
        setTheme: (state, action: PayloadAction<{ theme: PaletteMode }>) => {
            state.theme = action.payload.theme;
        }
    }
});

export const { setUser, resetUser, setTheme, setPalette } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;