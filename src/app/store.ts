import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import snackbarReducer from '../features/snackbar/snackbarSlice';
import mobileMenuReducer from '../features/mobile-menu/mobileMenuSlice';
import fetchingReducer from '../features/fetching/fetchingSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        snackbar: snackbarReducer,
        menu: mobileMenuReducer,
        fetching: fetchingReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
