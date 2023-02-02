import { Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import MobileMenuButton from "../MobileMenuButton/MobileMenuButton";
import MobileNavigationMenu from "../MobileNavigationMenu/MobileNavigationMenu";
import Navigation from "../Navigation/Navigation";
import SearchField from "../SearchField/SearchField";
import './Header.scss'

export function Header() {
    const palette = useAppSelector(state => state.user.palette);

    return (
        <Box id="header" className={palette} component="header" sx={{backgroundColor: 'primary.main' }}>
            <SearchField />
            <Navigation />
            <MobileMenuButton />
            <MobileNavigationMenu />
        </Box>
    );
}