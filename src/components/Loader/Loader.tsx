import { CircularProgress } from "@mui/material";
import './Loader.scss';

export default function CircularIndeterminate() {
    return (
        <div className="loader">
            <CircularProgress />
            <h1>Loading</h1>
        </div>
    );
}