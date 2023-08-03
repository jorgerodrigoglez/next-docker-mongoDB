import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { CartContext, UiContext } from '@/contextjrg';
import { AppBar, Toolbar, Typography, Link, Box, Button, IconButton, Badge, Input, InputAdornment } from "@mui/material";
import Icon from '@mui/material/Icon';

export const NavBar = () => {

const { asPath, push } = useRouter();
// toggleSideMenu
const { toggleSideMenu } = useContext( UiContext );
const { numberOfItems } = useContext( CartContext );

// termino de busqueda input
const [searchTerm, setSearchTerm] = useState('');
// 
const [isSearchVisible, setIsSearchVisible] = useState(false);

const onSearchTerm = () => {
    if(searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
}


return(
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref legacyBehavior>
                <Link display="flex" alignItems="center">
                    <Typography variant="h6">My</Typography>
                    <Typography sx={{ ml: .1 }}>Shop</Typography>

                </Link>
            </NextLink>

            <Box flex={1}/>

            <Box sx={{display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className="fadeIn">
                <NextLink href='/category/men' passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/men' ? 'primary' : 'info'} >Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/women' passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/kid' passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                    </Link>
                </NextLink>
            </Box>
            
            <Box flex={1}/>

            {/*Pantallas grandes */}

            {
                isSearchVisible 
                    ? (

                        <Input
                           sx={{display: { xs: 'none', sm: 'flex' } }}
                           className='fadeIn'
                           autoFocus
                           value= {searchTerm}
                           onChange={ (e) => setSearchTerm(e.target.value) }
                           onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                           type='text'
                           placeholder="Buscar..."
                           endAdornment={
                               <InputAdornment position="end">
                                   <IconButton
                                       aria-label="toggle password visibility"
                                       onClick={ () => setIsSearchVisible(false) }
                                   >
                                       <Icon className="material-icons-outlined">cancel</Icon>
                                   </IconButton>
                               </InputAdornment>
                           }
                       />
                    ):(
                        <IconButton
                            className='fadeIn'
                            onClick={ () => setIsSearchVisible(true) }
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            <Icon className="material-icons-outlined">search</Icon>
                        </IconButton>
                    )
            }


            {/*Pantallas pequeñas*/}
            <IconButton
                 sx={{ display: { xs: 'flex', sm: 'none' } }}
                 onClick={ toggleSideMenu }
            >
                <Icon className="material-icons-outlined">search</Icon>
            </IconButton>
          
            <NextLink href='/cart' passHref legacyBehavior>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color="secondary">
                            <Icon className="material-icons-outlined">shopping_cart</Icon>
                        </Badge>

                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={toggleSideMenu}>
                Menu
            </Button>

        </Toolbar>
    </AppBar>
)}
