import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

/**Interface for mobile menu.
 */
export interface IMobileMenu {
    open?: boolean;
}

const initialState: IMobileMenu = {
    open: false,
};

export const mobileMenuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        /**
         * Sets ``open`` to ``true``
         * @param state 
         * @param action 
         */
        openMenu: (state) => {
            state.open = true;
        },
        /**
         * Sets ``open`` to ``false``
         * @param state 
         */
        closeMenu: (state) => {
            state.open = false;
        },
    }
});

export const { openMenu, closeMenu } = mobileMenuSlice.actions;
export const selectMobileMenu = (state: RootState) => state.menu;
export default mobileMenuSlice.reducer;