import { Drawer, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeMenu, openMenu, selectMobileMenu } from "../../features/mobile-menu/mobileMenuSlice";
import { selectUser } from "../../features/user/userSlice";
import MobileListItem from "./MobileListItem";
import './MobileNavigationMenu.scss';

export default function MobileNavigationMenu() {
    const menu = useAppSelector(selectMobileMenu);
    const dispatch = useAppDispatch();
    const open = menu.open;

    const user = useAppSelector(selectUser);

    let authElements: JSX.Element = <></>;
    if (user._id) {
        authElements = (
            <>
                <MobileListItem to="/profile" icon="user">Profile</MobileListItem>
                <MobileListItem to="/product/create" icon="plus">New product</MobileListItem>
                <MobileListItem to="/logout" icon="sign-out">Logout</MobileListItem>
            </>
        );
    } else {
        authElements = (
            <>
                <MobileListItem to="/register" icon="address-card">Register</MobileListItem>
                <MobileListItem to="/login" icon="sign-in">Login</MobileListItem>
            </>
        );
    }

    function handleClose() {
        if (open) {
            dispatch(closeMenu())
        } else {
            dispatch(openMenu())
        }
    }
    return (
        <Drawer anchor="left" open={open} variant="temporary" onClose={handleClose} id="mobile-nav">
            <nav>
                <List className="mobile-links">
                    <MobileListItem to="/" icon="home">Home</MobileListItem>
                    <MobileListItem to="/product/all" icon="th-list">All</MobileListItem>
                    {authElements}
                    <li>
                        <ListItemButton onClick={handleClose} divider className="close">
                            <ListItemIcon>
                                <span className="fa fa-close"></span>
                            </ListItemIcon>
                            Close
                        </ListItemButton>
                    </li>
                </List>
            </nav>
        </Drawer>
    )
}