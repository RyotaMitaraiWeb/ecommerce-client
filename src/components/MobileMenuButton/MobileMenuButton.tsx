import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeMenu, openMenu, selectMobileMenu } from "../../features/mobile-menu/mobileMenuSlice";
import './MobileMenuButton.scss';

export default function MobileMenuButton() {
    const dispatch = useAppDispatch();
    const { open } = useAppSelector(selectMobileMenu);
    function handleClick() {
        if (open) {
            dispatch(closeMenu())
        } else {
            dispatch(openMenu())
        }
    }
    
    return (
        <IconButton aria-label="Open mobile menu" id="mobile-menu-button" onClick={handleClick}>
            <span className="fa fa-bars"></span>
        </IconButton>
    )
}