import jwt from 'jsonwebtoken';

// generar token
export const signToken = ( _id: string, email: string ) => {

    if(!process.env.JWT_SECRET_SEED){
        throw new Error('El token no está definido - revisar las variables de entorno');
    }

    // regresa un string
    return jwt.sign(
        // payload
        { _id , email },
        // secret key
        process.env.JWT_SECRET_SEED,
        // opciones
        { expiresIn: '1d' }

    )
}

// revalidar token
export const isValidToken = ( token: string ):Promise<string> => {

    if(!process.env.JWT_SECRET_SEED){
        throw new Error('El token no está definido - revisar las variables de entorno');
    }

    if( token.length <= 10){
        return Promise.reject('JWT no es válido');
    }

    return new Promise( (resolve, reject) => {

        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED || '', (error, payload) => {
                if(error) return reject('JWT no es válido');

                const { _id } = payload as { _id:string };
                resolve(_id);
            });
        } catch (error) {
            reject('JWT no válido')
        }
    })
}