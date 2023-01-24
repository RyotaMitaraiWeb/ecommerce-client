import { Button, FormControl, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { openSnackbar } from "../../features/snackbar/snackbarSlice";
import { IUserState, setUser } from "../../features/user/userSlice";
import { IAuthResponse, IError } from "../../interfaces";
import { HttpStatus } from "../../util/httpstatus.enum";
import { get, post } from "../../util/requests/requests";
import { splitErrorMessagesIntoMultipleLines } from "../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines";
import ValidationField from "../ValidationField/ValidationField";
import './Authentication.scss';

export interface IFormInput {
    username: string;
    password: string;
}

export default function Register() {
    const [showPassword, setPasswordVisibility] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleClick() {
        setPasswordVisibility(!showPassword);
    }

    function changeUsername(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setUsername(value);
    }

    function changePassword(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        setPassword(value);
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const form = new FormData(target);
        const username = form.get('username');
        const password = form.get('password');

        const { res, data } = await post<IAuthResponse | IError[]>('/user/register', { username, password });
        if (res.ok) {
            localStorage.setItem('accessToken', (data as IAuthResponse).accessToken);
            dispatch(setUser(data as IUserState));
            dispatch(openSnackbar({
                message: 'Registered successfully!',
                severity: 'success',
            }));

            navigate('/');
        } else {
            const errors = data as IError[];
            const message = splitErrorMessagesIntoMultipleLines(errors);
            dispatch(openSnackbar({
                message,
                severity: 'error',
            }));
        }
    }

    return (
        <section className="login auth">
            <h1>Register</h1>
            <FormControl component="form" className="form" onSubmit={onSubmit}>
                <ValidationField 
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    onChange={changeUsername}
                    required={[true, 'Username is required']}
                    className="field"
                    helperText="Username must be between 5 and 10 characters long, start with an English letter
                    and contain only alphanumeric characters"
                    minLength={[5, 'Username must be at least five characters']}
                    maxLength={[10, 'Username must be no longer than 10 characters']}
                    pattern={[/^[a-z][a-z0-9]+$/i, 'Username must start with an English letter and contain only alphanumeric values']}
                />
                <ValidationField
                    id="password"
                    label="Password"
                    name="password"
                    value={password}
                    onChange={changePassword}
                    required={[true, 'Password is required']}
                    className="field"
                    helperText="Password must be at least six characters"
                    type={showPassword ? 'text' : 'password'}
                    minLength={[6, 'Password must be at least six characters']}
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
                    disabled={!(username && password)}
                >
                    <span className="fa fa-sign-in"></span>
                    Sign up
                </Button>
            </FormControl>
        </section>
    )
}