import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/databasejrg';
import { Product } from '@/modelsjrg';
import { IProduct } from '@/interfacesjrg';

type Data = 
| {message: string}
| IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    switch (req.method) {
        case 'GET':
            return getProductbySlug( req, res );
        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }
}

async function getProductbySlug(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    await db.connect();
    const { slug } = req.query;
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();

    if(!product){
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    // procesar imagenes al subirlas al server
    // diferencia las imagenes de fileSystem de las que vienen de cloudinary
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${ image }`
    });

    return res.json( product );
}
