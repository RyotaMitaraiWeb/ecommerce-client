import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { environment as dev } from '../../environment/env.development';
import { environment as prod } from "../../environment/env.production";

export default function SearchField() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    function handleChange(event: ChangeEvent) {
        const el = event.target as HTMLInputElement;
        setTitle(el.value);
    }

    function handleClick() {
        if (title.trim() !== '') {
            return navigate('/product/search' + '?name=' + title);
        }


    }
    return (
        <TextField
            value={title}
            onChange={handleChange}
            id="search"
            name="search"
            variant="filled"
            label="Search by title"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleClick} aria-label="results">
                            <span className="fa fa-search"></span>
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}