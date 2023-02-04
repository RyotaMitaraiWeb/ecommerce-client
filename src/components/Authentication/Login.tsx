import { Button, FormControl, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useTitle } from "../../app/hooks";
import { openSnackbar } from "../../features/snackbar/snackbarSlice";
import { IUserState, setUser } from "../../features/user/userSlice";
import { IAuthResponse, IError } from "../../interfaces";
import { post } from "../../util/requests/requests";
import { splitErrorMessagesIntoMultipleLines } from "../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines";
import './Authentication.scss';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setPasswordVisibility] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useTitle('Login');
    const fetching = useAppSelector(state => state.fetching.fetching);

    function handleUsernameChange(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setUsername(value);
    }

    function handlePasswordChange(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setPassword(value);
    }

    function handleClick() {
        setPasswordVisibility(!showPassword);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { res, data } = await post<IAuthResponse | IError[]>('/user/login', { username, password });
        if (res.ok) {
            dispatch(setUser(data as IUserState));

            localStorage.setItem('accessToken', (data as IAuthResponse).accessToken);

            dispatch(openSnackbar({
                message: 'Successful login!',
                severity: 'success',
            }));

            navigate('/');
        } else {
            const errors = data as IError[];
            const messages = splitErrorMessagesIntoMultipleLines(errors);
            dispatch(openSnackbar({
                message: messages,
                severity: 'error',
            }));
        }
    }

    return (
        <section className="login auth">
            <h1>Login</h1>
            <FormControl component="form" onSubmit={handleSubmit} className="form">
                <TextField value={username}
                    onChange={handleUsernameChange}
                    id="username"
                    label="Username"
                    variant="filled"
                    required
                    className="field"
                />
                <TextField
                    value={password}
                    onChange={handlePasswordChange}
                    id="password"
                    label="Password"
                    variant="filled"
                    required
                    className="field"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip
                                    placement="top"
                                    title={`${showPassword ? 'hide' : 'show'} password`}
                                >
                                    <IconButton
                                        aria-label={`${showPassword ? 'hide' : 'show'} password`}
                                        onClick={handleClick}
                                    >
                                        <span className={`fa fa-eye${showPassword ? '-slash' : ''}`}></span>
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    className="submit"
                    type="submit"
                    variant="contained"
                    disabled={!(username && password) || fetching}
                >
                    <span className="fa fa-sign-in"></span>
                    Sign in
                </Button>
            </FormControl>
        </section>
    )
}