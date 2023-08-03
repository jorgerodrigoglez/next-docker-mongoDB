import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '@/databasejrg';
import { User } from '@/modelsjrg';
import { jwt, validations } from '@/utilsjrg';

type Data = 
| { message: string }
| { 
    token: string;
    user: {
        email: string;
        name: string;
        role: string
    }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    switch ( req.method) {
        case 'POST':
            return registerUser( req, res );
    
        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password = '', name = '' } = req.body as {email:string, password:string, name:string};
    
    if(password.length < 6){
        return res.status(400).json({
            message: 'La contraseña tiene que tener al menos 6 caracteres'
        });
    }

    if(name.length < 3){
        return res.status(400).json({
            message: 'El nombre tiene que tener al menos 2 caracteres'
        });
    }

    // validar email
    if( !validations.isValidEmail( email ) ){
        return res.status(400).json({
            message: 'Intrduzca un email válido'
        });
    }
    
    await db.connect();
    const user = await User.findOne({ email });

    if(user){
        res.status(400).json({
            message: 'Ese correo de usuario ya existe, introduzca uno diferente'
        })
    }
    
    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }


    const { _id, role } = newUser;

    // generar token
    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token,
        user: {
            email, name, role
        }
    })

}
