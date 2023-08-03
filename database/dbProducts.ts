import { Product } from '@/modelsjrg';
import { db } from './';
import { IProduct } from '@/interfacesjrg';
import { ImageList } from '@mui/material';

//* [slug].tsx
export const getProductBySlug = async( slug: string ): Promise<IProduct | null> => {

    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();

    if(!product){
        return null;
    }

    // procesar imagenes al subirlas al server
    // diferencia las imagenes de fileSystem de las que vienen de cloudinary
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${ image }`
    });

    return JSON.parse(JSON.stringify(product));

}

interface ProductSlug {
    slug: string
}

//* [slug].tsx
export const getAllProductsSlug = async(): Promise<ProductSlug[]> => {

    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await db.disconnect();

    return slugs;
}

//* [query].tsx
export const getProductsByTerm = async( term: string ): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();

    await db.connect();

    const products = await Product.find({
        $text: { $search: term }
    })
    .select('title images price slug inStock -_id')
    .lean();

    await db.disconnect();

    // procesar imagenes al subirlas al server
    // diferencia las imagenes de fileSystem de las que vienen de cloudinary
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${ image }`
        });

        return product;
    });

    //return products;
    return updatedProducts;
}

//* [query].tsx
export const getAllProducts = async(): Promise<IProduct[]> => {

    await db.connect();
    const products = await Product.find().lean();
    await db.disconnect();

    // procesar imagenes al subirlas al server
    // diferencia las imagenes de fileSystem de las que vienen de cloudinary
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${ image }`
        });

        return product;
    });

    //return JSON.parse(JSON.stringify(products));
    return JSON.parse(JSON.stringify( updatedProducts ));
}
