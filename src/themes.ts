import { amber, blue, deepPurple, green, indigo, pink } from "@mui/material/colors";

export type palette = 'blue' | 'indigo' | 'deepPurple' | 'green' | 'amber' | 'pink';
export type theme = 'light' | 'dark';

export const themes = {
    'deepPurple': deepPurple[500],
    'indigo': indigo[500],
    'blue': blue[500],
    'green': green[500],
    'amber': amber[500],
    'pink': pink[500],
};