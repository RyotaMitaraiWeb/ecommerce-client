import { Params, redirect } from "react-router-dom";
import { ISnackbar, openSnackbar } from "../../features/snackbar/snackbarSlice";
import { IError, IProductDetails } from "../../interfaces";
import { dispatchOutsideOfComponent } from "../../util/dispatchOutsideOfComponent";
import { redirectViaStatus } from "../../util/requests/redirect";
import { get } from "../../util/requests/requests";
import { splitErrorMessagesIntoMultipleLines } from "../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines";

/**
 * This guard blocks navigation attempts from users that
 * do not own the respective product.
 * This guard is compatible with routes that expose an ``:id`` in the path.
 * If the user is the owner of the product, the guard will return the product,
 * otherwise, it will redirect the user to the index, login, or not found page, depending
 * on the incompatibility.
 */
export async function ownerGuard({ params }: { params: Params<string>}) {
    const id = params['id'];
    const { res, data } = await get<IProductDetails | IError[]>(`/product/${id}/isOwner`);
    if (!res.ok) {        
        const errors = data as IError[];
        const message = splitErrorMessagesIntoMultipleLines(errors);
        dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
            message,
            severity: 'error',
        });

        return redirectViaStatus(res.status, true);
    }

    return data;
}