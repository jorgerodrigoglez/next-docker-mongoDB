
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext, UiContext } from "@/contextjrg";
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemButton,ListItemText, ListSubheader } from "@mui/material"
import Icon from '@mui/material/Icon';


export const SideMenu = () => {

    const router = useRouter();
    const { user, isLoggedIn, logout } = useContext( AuthContext );

    // toggleSideMenu
    const { toggleSideMenu, isMenuOpen } = useContext( UiContext );
    // busqueda input
    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`);
    }

    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        router.push(url);
    }


  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={toggleSideMenu}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
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
                                    onClick={ onSearchTerm }
                                >
                                    <Icon className="material-icons-outlined">search</Icon>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>

                {
                    isLoggedIn && (
                        <>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">account_circle</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                            </ListItemButton>

                            <ListItemButton onClick={ () => navigateTo('/orders/history')}>
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">receipt_long</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Mis Ordenes'} />
                            </ListItemButton>
                        </>
                    )
                }

                <ListItemButton 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/men')}
                >
                    <ListItemIcon>
                        <Icon className="material-icons-outlined">man_2</Icon>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItemButton>

                <ListItemButton 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/women')}
                >
                    <ListItemIcon>
                        <Icon className="material-icons-outlined">woman_2</Icon>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItemButton>

                <ListItemButton 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/kid')}
                >
                    <ListItemIcon>
                        <Icon className="material-icons-outlined">face_2</Icon>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItemButton>


                {
                    !isLoggedIn ? (
                        <ListItemButton onClick={ () => navigateTo(`/auth/login?p=${router.asPath}`) }>
                            <ListItemIcon>
                                <Icon className="material-icons-outlined">vpn_key</Icon>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItemButton>

                    ):(
                        <ListItemButton onClick={logout}>
                            <ListItemIcon>
                                <Icon className="material-icons-outlined" >logout</Icon>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItemButton>

                    )
                }



                {/* Admin */}
                {
                    (user?.role === 'super-user') || (user?.role === 'admin') && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItemButton
                                onClick={ () => navigateTo('/admin/') }
                            >
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">dashboard_customize</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItemButton>

                            <ListItemButton
                                onClick={ () => navigateTo('/admin/products/') }
                            >
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">shopping_cart_checkout</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItemButton>

                            <ListItemButton
                                onClick={ () => navigateTo('/admin/orders/') }
                            >
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">list_alt</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItemButton>

                            <ListItemButton
                                onClick={ () => navigateTo('/admin/users/') }
                            >
                                <ListItemIcon>
                                    <Icon className="material-icons-outlined">group</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItemButton>
                        
                        </>
                    )
                }
            </List>
        </Box>
    </Drawer>
  )
}
