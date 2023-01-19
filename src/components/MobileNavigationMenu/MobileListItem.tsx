import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";

export interface IMobileListItem {
    children: React.ReactNode;
    icon: string;
    to: string;
}

export default function MobileListItem(props: IMobileListItem) {
    return (
        <li>
            <ListItemButton divider component={Link} to={props.to} className="mobile-link">
                <ListItemIcon><span className={`fa fa-${props.icon}`}></span></ListItemIcon>
                {props.children}
            </ListItemButton>
        </li>
    );
}