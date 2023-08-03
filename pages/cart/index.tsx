
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ShopLayout } from "../../components/layouts";
import { CartContext } from "@/contextjrg";
import { Card, CardContent, Grid, Typography, Divider, Box, Button } from '@mui/material';
import { CartList, OrderSummary } from "../../components/cart";


const CartPage = () => {

    const router = useRouter();
    const { isLoaded, cart } = useContext( CartContext );

    useEffect(() => {
        if( isLoaded && cart.length === 0 ){
            router.replace('/cart/empty')
        }
    }, [ isLoaded, cart, router ]);

    if( !isLoaded || cart.length === 0 ){
        return (<></>);
    }
    

  return (
    <ShopLayout title="Carrito" pageDescription={"carrito de compras de la tienda"}>
       
       <Typography variant='h1' component='h1'>Carrito</Typography>
       
       <Grid container>

            <Grid item xs={12} sm={7}>
                <CartList editable/>
            </Grid>

            <Grid item xs={12} sm={5}>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{ my:1 }}></Divider>

                        <OrderSummary/>
                    </CardContent>
                </Card>

                <Box sx={{ mt:3}}>
                    <Button 
                        color='secondary' 
                        className='circular-btn' 
                        fullWidth
                        href='/checkout/address'
                    >
                        Checkout
                    </Button>
                </Box>

            </Grid>
       </Grid>
    </ShopLayout>
  )
}

export default CartPage