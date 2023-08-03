import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IPaypal } from '@/interfacesjrg';
import { db } from '@/databasejrg';
import { Order } from '@/modelsjrg';

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch (req.method) {
        case 'POST':
            return PayOrder( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
  
}

const getPaypalBearerToken = async():Promise<string|null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body , {
            headers:{
                'Authorization' : `Basic ${ base64Token }`,
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if( axios.isAxiosError(error) ){
            console.log(error.response?.data);
        }else{
            console.log(error);
        }

        return null;
    }
}

const PayOrder = async(req: NextApiRequest, res: NextApiResponse<Data>)=> {

    // Todo: validar sesión del usuario
    // TODO: validar mongoID

    const paypalBearerToken = await getPaypalBearerToken();

    if(!paypalBearerToken){
        return res.status(400).json({ message: ' No se pudo confirmar el token de paypal :( ' });
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>( `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization' : `Bearer ${ paypalBearerToken }`,
        }
    });

    if( data.status !== 'COMPLETED' ){
        return res.status(400).json({ message: 'Orden no reconocida' });
    }

    await db.connect();
    const dbOrder = await Order.findById( orderId );

    if(!dbOrder){
        await db.disconnect();
        return res.status(400).json({ message: 'La orden no existe en db' });
    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de PayPal y los de nuestra orden no son iguales...' });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();
    

    return res.status(200).json({ message: 'La compra fue pagada con éxito'});
}
