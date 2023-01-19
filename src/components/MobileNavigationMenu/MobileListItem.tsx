import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeMenu, openMenu, selectMobileMenu } from "../../features/mobile-menu/mobileMenuSlice";

export interface IMobileListItem {
    children: React.ReactNode;
    icon: string;
    to: string;
}

export default function MobileListItem(props: IMobileListItem) {
    const dispatch = useAppDispatch();
    const { open } = useAppSelector(selectMobileMenu);

    function handleClose() {
        if (open) {
            dispatch(closeMenu());
        } else {
            dispatch(openMenu());
        }
    }

    return (
        <li>
            <ListItemButton divider onClick={handleClose} component={Link} to={props.to} className="mobile-link">
                <ListItemIcon><span className={`fa fa-${props.icon}`}></span></ListItemIcon>
                {props.children}
            </ListItemButton>
        </li>
    );
}