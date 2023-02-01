import { redirect } from "react-router";
import Login from "../../../components/Authentication/Login";
import Register from "../../../components/Authentication/Register";
import { Home } from "../../../components/Home/Home";
import { ISnackbar, openSnackbar } from "../../../features/snackbar/snackbarSlice";
import { resetUser } from "../../../features/user/userSlice";
import { dispatchOutsideOfComponent } from "../../../util/dispatchOutsideOfComponent";
import { redirectViaStatus } from "../../../util/requests/redirect";
import { del, get } from "../../../util/requests/requests";
import { guestGuard } from "../../guards/guest";

export const indexRoutes = [
    {
        path: '/',
        element: <Home />,
        index: true,
    },
    {
        path: 'about',
        element: <h1>About</h1>,
    },
    {
        path: 'login',
        element: <Login />,
        loader: guestGuard,
    },
    {
        path: 'register',
        element: <Register />,
        loader: guestGuard,

    },
    {
        path: 'logout',
        element: null,
        loader: async () => {
            const { res, data } = await del('/user/logout');
            if (res.ok) {
                dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
                    severity: 'success',
                    message: 'Successfully logged out!',
                });

                dispatchOutsideOfComponent(resetUser);

                localStorage.removeItem('accessToken');
                return redirect('/');
            } else {
                dispatchOutsideOfComponent<ISnackbar>(openSnackbar, {
                    severity: 'error',
                    message: 'You must be logged in to perform this action!',
                });

                return redirectViaStatus(res.status, true);
            }
        }
    },
];