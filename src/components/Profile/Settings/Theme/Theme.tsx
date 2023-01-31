import { FormControlLabel, PaletteMode, Radio, Stack } from "@mui/material";
import { palette } from "@mui/system";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { openSnackbar } from "../../../../features/snackbar/snackbarSlice";
import { setTheme } from "../../../../features/user/userSlice";
import { IError } from "../../../../interfaces";
import { put } from "../../../../util/requests/requests";
import { splitErrorMessagesIntoMultipleLines } from "../../../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines";
import './Theme.scss';

export interface IThemeOptionProps {
    value: PaletteMode,
    label: string,
    icon: string,
    iconColor?: string,
}

export default function ThemeOption(props: IThemeOptionProps) {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.user.theme);
    async function changeTheme(event: React.SyntheticEvent) {
        const target = event.target as HTMLInputElement;
        const theme = target.value as PaletteMode;
        const { res, data } = await put<IError[]>('/user/theme', { theme });
        if (res.ok) {
            dispatch(setTheme({ theme }));
            dispatch(openSnackbar({
                message: 'Changed theme successfully!',
                severity: 'success',
            }));
        } else {
            const message = splitErrorMessagesIntoMultipleLines(data);
            dispatch(openSnackbar({
                message,
                severity: 'error',
            }));
        }
    }

    return (
        <Stack direction="column" justifyContent="center">
            <span className={`theme-icon fa fa-${props.icon}`} style={{color: props.iconColor || 'inherit'}}></span>
            <FormControlLabel
                labelPlacement="bottom"
                value={props.value}
                control={<Radio />}
                label={props.label}
                onChange={changeTheme}
                checked={theme === props.value}
            />
        </Stack>
    );
}