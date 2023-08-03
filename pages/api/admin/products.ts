import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '@/databasejrg';
import { Product } from '@/modelsjrg';
import { IProduct } from '@/interfacesjrg';


type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch (req.method) {

        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res );
        case 'POST':
            return createProduct(req, res );
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
  
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();
    const products = await Product.find()
        .sort({ title: 'asc' })
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

    //res.status(200).json( products );
    res.status(200).json( updatedProducts );
}

const  updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'el Id del producto no es válido' });
    }

    if( images.length < 2 ) {
        return res.status(400).json({ message: 'Se requieren al menos 2 imágenes'});
    }

    // todo: evitar url de imagen localhost:3000/products/image.png

    try {

        await db.connect();
        const product = await Product.findById(_id);

        if( !product ){
            await db.disconnect();
            return res.status(400).json({ message: 'No hay un producto con ese Id'});
        }

        // eliminar foto de cloudinary
        //https://res.cloudinary.com/dxxvqbsj9/image/upload/v1685445703/joaon1t9u0oznyshkkcv.webp
        product.images.forEach(async (image) => {
            if( !images.includes(image) ){
                // borrar imagen de cloudinary
                //const fileExtension = image.substring( image.lastIndexOf('/') + 1 ).split('.');
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.');
                console.log({image, fileId, extension});
                await cloudinary.uploader.destroy( fileId );
            }
        })

        await product.updateOne( req.body );
        await db.disconnect();

        return res.status(200).json( product );
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar los logs del servidor'});
    }

}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IProduct;

    if( images.length < 2 ) {
        return res.status(400).json({ message: 'Se requieren al menos 2 imágenes' });
    }

    // todo: evitar url de imagen localhost:3000/products/image.png

    try {
        
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });

        if( productInDB ){
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug'});
        }

        const newProduct = new Product( req.body );
        await newProduct.save();

        return res.status(201).json( newProduct );

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }
}

