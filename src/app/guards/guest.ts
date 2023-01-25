import { redirect } from "react-router-dom";
import { ISnackbar, openSnackbar } from "../../features/snackbar/snackbarSlice";
import { dispatchOutsideOfComponent } from "../../util/dispatchOutsideOfComponent";

/**
 * This guard prevents logged in users from navigating to a 
 * given page and redirects the user to the index page
 */
export function guestGuard() {
    if (localStorage.getItem('accessToken')) {
        dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
            message: 'You must be logged out to perform this action!',
            severity: 'error',
        });
        return redirect('/');
    }

    return null;
}