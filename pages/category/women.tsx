
import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '@/hooksjrg';
import { FullScreenLoading } from '@/components/uijrg';

const inter = Inter({ subsets: ['latin'] });

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women')

  return(
  <ShopLayout title={'Teslo-Women'} pageDescription={'Encuentra los mejores productos para mujeres'}>
    <Typography variant='h1' component='h1'>Mujeres</Typography>
    <Typography variant='h2' sx={{ mb: 1 }}>Ropa de mujer</Typography>

    {
      isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products }/>
    }


  </ShopLayout>
)}

export default WomenPage;