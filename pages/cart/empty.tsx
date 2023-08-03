import NextLink from 'next/link';
import { ShopLayout } from "../../components/layouts";
import { Box, Typography, Link } from '@mui/material';
import Icon from '@mui/material/Icon';

const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito de compras vacío" pageDescription={"No hay artículos en el carito de compras"}>
       <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs:'column', sm:'row' } }}
        >
            <Icon className="material-icons-outlined md-48">remove_shopping_cart</Icon>

            <Box display="flex" flexDirection="column" alignContent="center" sx={{ marginLeft: 1 }}>
                <Typography className="n">Su carrito está vacío</Typography>
                <NextLink href='/' passHref legacyBehavior>
                    <Link typography="h4" color="secondary">
                            Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage;
