import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

/**Interface for snackbar element. ``open`` is optional so that it does not have to be included
 * in any payload arguments, since this property will be handled by the reducers.
 */
export interface ISnackbar {
    severity: 'error' | 'warning' | 'info' | 'success';
    message: string;
    open?: boolean;
}

const initialState: ISnackbar = {
    severity: 'success',
    message: '',
    open: false,
};

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        /**
         * Sets ``open`` to true and ``message`` and ``severity`` to the provided values.
         * **Note:** passing the property ``open`` in the payload won't have any effect, so there is
         * no need to pass it when dispatching.
         * @param state 
         * @param action 
         */
        openSnackbar: (state, action: PayloadAction<ISnackbar>) => {
            state.message = action.payload.message;
            state.open = true;
            state.severity = action.payload.severity;
        },
        /**
         * Sets ``open`` to false
         * @param state 
         */
        closeSnackbar: (state) => {
            state.open = false;
        },
    }
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export const selectSnackbar = (state: RootState) => state.snackbar;
export default snackbarSlice.reducer;