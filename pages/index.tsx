
import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import { Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts';
// data temporal
//import { initialData } from '../database/products';
import { ProductList } from '../components/products';
import { useProducts } from '@/hooksjrg';
import { FullScreenLoading } from '@/components/uijrg';

const inter = Inter({ subsets: ['latin'] });

const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products')

  return(
  <ShopLayout title={'Teslo-Home'} pageDescription={'Encuentra los mejores productos'}>
    <Typography variant='h1' component='h1'>Tienda</Typography>
    <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

    {
      isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products }/>
    }

    {/*<Grid container spacing={4}>
      {
        initialData.products.map( product => (
          <Grid item xs={6} sm={4} key={product.slug}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component='img'
                  image={ `products/${product.images[0] }` }
                  alt={ product.title }
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))
      }
    </Grid>*/}

  </ShopLayout>
)}

export default HomePage;
