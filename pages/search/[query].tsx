
import { NextPage, GetServerSideProps } from 'next';
import { Inter } from 'next/font/google';
import { Typography, Box } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
// data temporal
//import { initialData } from '../database/products';
import { ProductList } from '../../components/products';
import { dbProducts } from '@/databasejrg';
import { IProduct } from '@/interfacesjrg';
import { FullScreenLoading } from '@/components/uijrg';

const inter = Inter({ subsets: ['latin'] });

interface Props {
    products: IProduct[];
    foundProducts : boolean;
    query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return(
  <ShopLayout title={'Teslo-Search'} pageDescription={'Busca productos'}>
    <Typography variant='h1' component='h1'>Búsqueda</Typography>

    {
        foundProducts
            ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: {query}</Typography>
            : (
                <Box display='flex'>
                    <Typography variant='h2' sx={{ mb: 1 }}>No se encontró ningún producto</Typography>
                    <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
                </Box>
            )
    }
   
    <ProductList products={ products }/>
    
  </ShopLayout>
)}

//* getServerSideProps...
export const getServerSideProps: GetServerSideProps = async({ params }) => {

  const { query = '' } = params as { query: string };

  if(query.length === 0){
    return{
        redirect: {
            destination: '/',
            permanent: true
        }
    }
  }

  let products = await dbProducts.getProductsByTerm( query );

  // Si no hay productos
  const foundProducts = products.length > 0
  // TODO: devolver otros productos
  if( !foundProducts ){
    products = await dbProducts.getAllProducts()
    //products = await dbProducts.getProductsByTerm('men')
  }

  return {
    props:{
        products,
        foundProducts,
        query
    }
  };
}

export default SearchPage;