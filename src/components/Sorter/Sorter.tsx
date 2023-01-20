import { FormControl, InputLabel, Select, MenuItem, Stack, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import './Sorter.scss';

/**
 * This component renders a widget that sorts a list of products in a search or catalogue page.
 * It updates the current URL with the appropriate ``sort`` and ``by`` query strings and also
 * maintains the ``page`` and ``name`` query strings if such exist in the URL.
 * **Note:** the default sort option is Name (Ascending)
 */
export default function Sorter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get('sort') || '';
    const by = searchParams.get('by') || '';
    const page = searchParams.get('page');
    const name = searchParams.get('name');

    const [value, setValue] = useState('name-asc');

    function handleChange(event: SelectChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;
        const [by, sort] = value.split('-');

        const queries: any = { sort, by };
        if (page) {
            queries.page = page;
        }

        if (name) {
            queries.name = name;
        }

        setValue(value);
        setSearchParams(queries);
    }

    useEffect(() => {
        if (sort && by) {
            setValue(`${by}-${sort}`);
        }
    }, [by, sort]);

    return (
        <Stack direction="row" justifyContent="center" className="sort-stack">
            <FormControl className="sorter">
                <InputLabel id="sort">Sort by</InputLabel>
                <Select labelId="sort" id="sort-by" label="Sort by" value={value} onChange={handleChange}>
                    <MenuItem value="name-asc">Name (ascending)</MenuItem>
                    <MenuItem value="name-desc">Name (descending)</MenuItem>
                    <MenuItem value="price-asc">Price (ascending)</MenuItem>
                    <MenuItem value="price-desc">Price (descending)</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}