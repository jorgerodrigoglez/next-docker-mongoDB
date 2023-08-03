import { useRouter } from 'next/router';
//import { initialData } from '../../database/products';
import { useState, useContext } from 'react';
import { CartContext } from '@/contextjrg';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Divider, Grid, Box, Typography, Button, Chip } from '@mui/material';
//import { useProducts } from '@/hooksjrg';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';

import { ICartProduct, IProduct, ISize } from '@/interfacesjrg';
import { dbProducts } from '@/databasejrg';

//const product = initialData.products[0];

interface Props {
  product: IProduct;
}

const ProductPage:NextPage<Props> = ({ product }) => {

  const router = useRouter();
  //const { products: product, isLoading } = useProducts(`/products/${ router.slug.query }`);
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = ( size: ISize) => {
    //console.log('En padre', size);
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const onUpdateQuantity = ( newQuantity: number ) => {
    //console.log('En padre', size);
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity: newQuantity
    }))
  }

  const onAddProduct = () => {
    if(!tempCartProduct.size) return;

    // llamar a la acción del context para agregar al carrito
    //console.log({tempCartProduct});
    addProductToCart(tempCartProduct);
    //router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow
            images={product.images}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>
       

            <Box sx={{ my: 2 }}>

              <Divider/>

              <SizeSelector 
                sizes={product.sizes}
                selectedSize={tempCartProduct.size} 
                onSelectedSize={ selectedSize }
              />

              <Divider sx={{ mb: 2 }}/>

              <Typography sx={{ mb: 1 }} variant='subtitle2'>Cantidad:</Typography>
              <ItemCounter 
                currentValue={tempCartProduct.quantity}
                updateQuantity={ onUpdateQuantity }
                maxValue={ product.inStock > 10 ? 10 : product.inStock }
              />
            </Box>

            {/* Agregar al carrito */}
            {
              (product.inStock > 0 )
                ? (
                <Button 
                  color='secondary' 
                  className="circular-btn" 
                  sx={{ mt: 1 }}
                  onClick={onAddProduct}
                >
                  {
                    tempCartProduct.size
                      ? 'Agregar a carrito'
                      : 'Selecciona una talla'
                  }
                
                </Button>

                ):(
                  <Chip label='No hay disponibles' color='error' variant='outlined' />

                )
            }

            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle1'>Description:</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>

          </Box>

        </Grid>

      </Grid>

    </ShopLayout>
  )
}

//* getServerSideProps...
//* No usar esto, aunque puede resolver el problema de buscar los producto por el slug
/*export const getServerSideProps: GetServerSideProps = async({ params }) => {

  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if(!product){
    return{
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props:{
      product
    }
  };
}*/

//* getStaticPath...
// blocking
export const getStaticPaths: GetStaticPaths = async(ctx) => {

  const productsSlug = await dbProducts.getAllProductsSlug()

  return {
    paths: productsSlug.map( ({ slug }) => ({
      params: {
        slug
      }
    })),

    /*path: [
      {
        params: {}
      }
    ],*/

    fallback: "blocking"
  }
}

//* getStaticProps...
// revalidar cada 24h
export const getStaticProps: GetStaticProps = async({params}) => {

  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if(!product){
    return{
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props:{
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage;