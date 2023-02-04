import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

/**Interface for fetching state
 */
export interface IFetching {
    fetching: boolean;
}

const initialState: IFetching = {
    fetching: false,
};

/** Use this to disable things like submit buttons while fetching is happening */
export const fetchingSlice = createSlice({
    name: 'fetching',
    initialState,
    reducers: {
        /**
         * Sets ``fetching'' to ``true``
         * @param state 
         * @param action 
         */
        startFetching: (state) => {
            state.fetching = true;
        },
        /**
         * Sets ``fetching'' to ``false``
         * @param state 
         */
        finishFetching: (state) => {
            state.fetching = false;
        },
    }
});

export const { startFetching, finishFetching } = fetchingSlice.actions;
export const selectSnackbar = (state: RootState) => state.fetching;
export default fetchingSlice.reducer;