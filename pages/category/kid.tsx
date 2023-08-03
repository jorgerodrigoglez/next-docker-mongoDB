
import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '@/hooksjrg';
import { FullScreenLoading } from '@/components/uijrg';

const inter = Inter({ subsets: ['latin'] });

const KidPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=kid')

  return(
  <ShopLayout title={'Teslo-Kid'} pageDescription={'Encuentra los mejores productos para niños'}>
    <Typography variant='h1' component='h1'>Niños</Typography>
    <Typography variant='h2' sx={{ mb: 1 }}>Ropa de niños</Typography>

    {
      isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products }/>
    }


  </ShopLayout>
)}

export default KidPage;