import { redirect } from "react-router-dom";
import { HttpStatus } from "../httpstatus.enum";

/**
 * This function is used within the ``router`` object's ``loader`` properties.
 * By returning it in the loader, it will redirect the user to specific pages, depending on status code:
 * * 404 - to a "not-found" page
 * * 403 - to the home page
 * * everything else - no redirect (returns ``null``)
 * 
 * When the function returns ``null``, this will allow the loader to proceed with the rendering.
 * If you want to use this function and also load data upon success, 
 * use the logical OR operator (``||``) to return either null or the data to be loaded
 * @param {number} status - status code of the response
 * @returns 
 */
export function redirectViaStatus(status: number) {
    if (status === HttpStatus.NOT_FOUND) {
        return redirect('/not-found');
    } else if (status === HttpStatus.FORBIDDEN) {
        return redirect('/');
    }

    return null;
}