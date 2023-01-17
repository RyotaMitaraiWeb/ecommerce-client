import { Alert, Snackbar } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeSnackbar, selectSnackbar } from "./snackbarSlice";

/**
 * This component renders a snackbar at the bottom center of the page. To toggle its visibility,
 * severity, and message,
 * check out the Redux store's ``snackbarSlicer`` feature.
 */
export default function SnackbarAlert() {
    const snackbar = useAppSelector(selectSnackbar);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (snackbar.open) {
            setTimeout(() => {
                dispatch(closeSnackbar());
            }, 5000)
        }
    }, [snackbar]);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbar.open}
            onClose={() => { dispatch(closeSnackbar()) }}
        >
            <Alert variant="filled"
                sx={{ width: '100%' }}
                onClose={() => { dispatch(closeSnackbar()) }}
                severity={snackbar.severity}>{snackbar.message}
            </Alert>
        </Snackbar>
    )
}