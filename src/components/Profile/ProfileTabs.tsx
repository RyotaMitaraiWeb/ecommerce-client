import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import './Profile.scss';

export default function ProfileTabs({ currentTab }: { currentTab: number }) {
    return (
        <section className="profile">
            <Box className="tabs" sx={{marginTop: 0.5 }}>
                <AppBar position="static">
                    <Tabs value={currentTab} textColor="inherit" variant="fullWidth" indicatorColor="secondary">
                        <Tab href="/profile/products" label="My products" />
                        <Tab href="/profile/purchases" label="My purchases" />
                        <Tab href="/profile/settings" label="My settings" />
                    </Tabs>
                </AppBar>
            </Box>
        </section>
    );
}