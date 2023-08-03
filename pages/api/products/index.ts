import type { NextApiRequest, NextApiResponse } from 'next';
import { SHOP_CONSTANTS, db } from '@/databasejrg';
import { Product } from '@/modelsjrg';
import { IProduct } from '@/interfacesjrg';


type Data = 
| { message: string}
| IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    switch (req.method) {
        case 'GET':
            return getProducts( res, req );
    
        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }
}

const getProducts = async(res: NextApiResponse<Data>, req: NextApiRequest) => {

    const { gender = 'all' } = req.query;

    let condition = {};

    if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
        condition = { gender }
    }
    
    await db.connect();
    const products = await Product.find(condition)
                                    .select('title images price inStock slug -_id')
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

    //return res.status(200).json( products );
    return res.status(200).json( updatedProducts );
}

