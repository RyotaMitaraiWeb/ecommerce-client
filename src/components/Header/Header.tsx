import { Box } from "@mui/material";
import MobileMenuButton from "../MobileMenuButton/MobileMenuButton";
import MobileNavigationMenu from "../MobileNavigationMenu/MobileNavigationMenu";
import Navigation from "../Navigation/Navigation";
import SearchField from "../SearchField/SearchField";
import './Header.scss'

export function Header() {
    return (
        <Box id="header" component="header" sx={{backgroundColor: 'primary.main' }}>
            <SearchField />
            <Navigation />
            <MobileMenuButton />
            <MobileNavigationMenu />
        </Box>
    );
}