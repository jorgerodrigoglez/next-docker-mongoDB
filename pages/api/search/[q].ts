import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/databasejrg';
import { Product } from '@/modelsjrg';
import { IProduct } from '@/interfacesjrg';

type Data = 
| {message: string}
| IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    switch (req.method) {
        case 'GET':
            return searchProducts( res, req );
    
        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }
}

const searchProducts = async(res: NextApiResponse<Data>, req: NextApiRequest) => {
    
    let { q = '' } = req.query;
    
    if( q.length === 0 ){
        return res.status(400).json({
            message: 'Debe especificar el query de búsqueda'
        });
    }

    q = q.toString().toLowerCase();

    await db.connect();

    const products = await Product.find({
        $text: { $search: q }
    })
    .select('title images price slug inStock -_id')
    .lean();

    await db.disconnect();

    return res.status(200).json(products);
}
