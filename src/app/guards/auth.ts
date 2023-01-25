import { redirect } from "react-router-dom";
import { ISnackbar, openSnackbar } from "../../features/snackbar/snackbarSlice";
import { dispatchOutsideOfComponent } from "../../util/dispatchOutsideOfComponent";

/**
 * This guard prevents guests from navigating to a 
 * given page and redirects the user to the login page
 */
export function authGuard() {
    if (!localStorage.getItem('accessToken')) {
        dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
            message: 'You must be logged in to perform this action!',
            severity: 'error',
        });
        return redirect('/login');
    }

    return null;
}