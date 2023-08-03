import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDB } from '@/databasejrg';
import { Order, Product, User } from '@/modelsjrg';

type Data = {
  message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
    ) {
        
    if(process.env.NODE_ENV === 'production'){
        return res.status(401).json({ message: 'No tiene acceso a este API'})
    }
    
    await db.connect();

    await User.deleteMany();
    await User.insertMany( seedDB.initialData.users );

    await Product.deleteMany();
    await Product.insertMany( seedDB.initialData.products );

    await Order.deleteMany();


    await db.disconnect();


  res.status(200).json({ message: 'Proceso realizado correctamente' })
}