import { FormControlLabel, FormLabel, Radio, RadioGroup, Stack, ToggleButton } from "@mui/material";
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { openSnackbar } from "../../../../features/snackbar/snackbarSlice";
import { IUserState, setPalette } from "../../../../features/user/userSlice";
import { IError } from "../../../../interfaces";
import { palette, themes } from "../../../../themes";
import { put } from "../../../../util/requests/requests";
import { splitErrorMessagesIntoMultipleLines } from "../../../../util/splitErrorMessagesIntoMultipleLines/splitMessagesIntoMultipleLines";
import './Palette.scss';

export interface IPaletteOptionProps {
    value: palette;
    label: string;
}

export default function PaletteOption(props: IPaletteOptionProps) {
    const dispatch = useAppDispatch();
    const palette = useAppSelector(state => state.user.palette);

    async function changePalette(event: React.SyntheticEvent) {
        const target = event.target as HTMLInputElement;
        const palette = target.value as palette;
        const { res, data } = await put<IError[]>('/user/palette', { palette });
        if (res.ok) {
            dispatch(setPalette({ palette }));
            dispatch(openSnackbar({
                message: 'Changed app color successfully!',
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
            <div className="palette" style={{backgroundColor: themes[props.value]}}></div>
            <FormControlLabel
                labelPlacement="bottom"
                value={props.value}
                control={<Radio />}
                label={props.label}
                onChange={changePalette}
                checked={props.value === palette}
            />
        </Stack>
    );
}