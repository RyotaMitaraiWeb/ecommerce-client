import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import './Navigation.scss';

export default function Navigation() {
    const user = useAppSelector(selectUser);
    let authElemetLinks: JSX.Element = <></>;

    if (user._id) {
        authElemetLinks = (
            <>
                <li><Link to="/profile"><span className="fa fa-user"></span>Profile</Link></li>
                <li><Link to="/product/create"><span className="fa fa-plus"></span>New product</Link></li>
                <li><Link to="/logout"><span className="fa fa-sign-out"></span>Logout</Link></li>
            </>
        );
    } else {
        authElemetLinks = (
            <>
                <li><Link to="/register"><span className="fa fa-address-card"></span>Register</Link></li>
                <li><Link to="/login"><span className="fa fa-sign-in"></span>Login</Link></li>
            </>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'primary.main' }} component="nav" id="nav">
            <ul className="links">
                <li><Link to="/"><span className="fa fa-home"></span>Home</Link></li>
                <li><Link to="/product/all"><span className="fa fa-th-list"></span>All</Link></li>
                {authElemetLinks}
            </ul>
        </Box>
    )
}