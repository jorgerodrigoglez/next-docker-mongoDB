import { useContext } from 'react';
import NextLink from 'next/link';
import { UiContext } from '@/contextjrg';
import { AppBar, Toolbar, Typography, Link, Box, Button } from "@mui/material";
import Icon from '@mui/material/Icon';

export const AdminBar = () => {

// toggleSideMenu
const { toggleSideMenu } = useContext( UiContext );


return(
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref legacyBehavior>
                <Link display="flex" alignItems="center">
                    <Typography variant="h6">My</Typography>
                    <Typography sx={{ ml: .5 }}>Shop</Typography>

                </Link>
            </NextLink>

            <Box flex={1}/>     

            <Button onClick={toggleSideMenu}>
                Menu
            </Button>

        </Toolbar>
    </AppBar>
)}

