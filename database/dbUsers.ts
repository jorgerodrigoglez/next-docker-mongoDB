import { db } from './';
import { User } from '@/modelsjrg';
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async( email: string, password: string ) => {

    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if( !user ){
        return null;
    }

    if( !bcrypt.compareSync( password, user.password! )){
        return null;
    }

    const { role, name, _id } = user;

    return {
        _id,
        name,
        email: email.toLowerCase(),
        role
    }
}

// esta funcion crea o verifica el usuario de OAuth
export const onAuthToDbUser = async( onAuthEmail: string, onAuthName: string ) => {
    await db.connect();
    const user = await User.findOne({ email: onAuthEmail });

    if( user ){
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: onAuthEmail, name: onAuthName, password: '@', role: 'client' });
    await newUser.save();
    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };

}