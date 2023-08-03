
import type { NextApiRequest, NextApiResponse } from 'next';
//import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { db } from '@/databasejrg';
import { IOrder } from '@/interfacesjrg';
import { Order, Product } from '@/modelsjrg';

type Data = 
| { message: string }
| IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch (req.method) {
        case 'POST':
            return createOrder( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
  
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) =>  {
   
    const { orderItems, total } = req.body as IOrder;

    // verificar que hay un usuario
    //** Esto NO funciona */
    //const session:any = await getSession({ req });
    //console.log({session});
    //** Esto funciona */
    const session: any = await getServerSession(req, res, authOptions);
    //console.log({session});

    if(!session){
        return res.status(401).json({ message: 'La autenticación es necesaria para realizar la operación'});
    }

    // crear un arreglo de los productos solicitados de la BBDD
    const productsIds = orderItems.map( product => product._id );
    await db.connect();

    // comprobar que los precios vienen del backend
    const dbProducts = await Product.find({ _id: { $in: productsIds }});
    //console.log({dbProducts});

    try {
        
        const subTotal = orderItems.reduce(( prev, current ) => {
            
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;

            if(!currentPrice){
                throw new Error('Compruebe el carrito de nuevo, el producto no existe');
            }
            return (currentPrice * current.quantity) + prev;
        }, 0 );

        const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );
        const priceTotalBackend = subTotal * ( taxRate + 1 );

        if(total !== priceTotalBackend){
            throw new Error('El total no cuadra con el monto');
        }

        // Si todo esta bien hasta este punto
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100 ) / 100;
        await newOrder.save();
        db.disconnect();
        return res.status(201).json( newOrder );


    } catch (error:any) {
        db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
    }

}
