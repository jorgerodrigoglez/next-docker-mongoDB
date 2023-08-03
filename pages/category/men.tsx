
import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '@/hooksjrg';
import { FullScreenLoading } from '@/components/uijrg';

const inter = Inter({ subsets: ['latin'] });

const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men')

  return(
  <ShopLayout title={'Teslo-Men'} pageDescription={'Encuentra los mejores productos para hombres'}>
    <Typography variant='h1' component='h1'>Hombre</Typography>
    <Typography variant='h2' sx={{ mb: 1 }}>Ropa de hombres</Typography>

    {
      isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products }/>
    }


  </ShopLayout>
)}

export default MenPage;