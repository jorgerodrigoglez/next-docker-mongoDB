
import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { AuthLayout } from "@/components/layoutsjrg";
import { Box, Grid, TextField, Typography, Button, Link, Chip } from "@mui/material";
import { useRouter } from 'next/router';
import { AuthContext } from '@/contextjrg';
import { useForm } from 'react-hook-form';
import { validations } from '@/utilsjrg';
//import { tesloApi } from '@/apijrg';


type FormData = {
    name: string;
    email: string,
    password: string,
};


const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    //console.log({errors});
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterUser = async( {name, email, password}: FormData ) => {
        //console.log({data});

        setShowError(false);
        
        const { hasError, message } = await registerUser( name, email, password );

        if( hasError ){
            setShowError(true);
            setErrorMessage( message! )
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }

        // navegar a la pantalla en la que se encontraba el usuario
        //const destination = router.query.p?.toString() || '/';
        //router.replace(destination);

        // Next Auth
        await signIn('credentials', { email, password });

        /*try {
            const { data } = await tesloApi.post('/user/register', {name,password,email} );
            const { token, user } = data;
            console.log({token,user});

        } catch (error) {
            console.log('Error en las credenciales');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }*/


    }


  return (
    <AuthLayout title={'Registro'}>
         <form onSubmit={handleSubmit(onRegisterUser)} noValidate >

            <Box sx={{ width: 350, padding:'10px 20px', mt:20}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Registro</Typography>
                        <Chip
                            label="El email ya está registrado y no se puede crear el usuario"
                            color="error"
                            className="fadeIn"
                            sx={{ display: showError ? 'flex' : 'none', mt:1, mb:1}}
                        />
                    </Grid>


                    <Grid item xs={12}>
                    <TextField 
                        label="Nombre" 
                        variant="filled" 
                        fullWidth
                        { ...register('name', {
                            required: 'Este campo es requerido',
                            minLength: { value: 2, message: 'El nombre debe tener mínimo 2 caracteres'}
                        })}
                        error={ !!errors.name }
                        helperText={ errors.name?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField 
                        type='email'
                        label="Email" 
                        variant="filled" 
                        fullWidth
                        { ...register('email', {
                            required: 'Este campo es requerido',
                            validate: validations.isEmail
                        })}
                    error={ !!errors.email }
                    helperText={ errors.email?.message }
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField 
                        type="password"
                        label="Contraseña"  
                        variant="filled" 
                        fullWidth
                        { ...register('password', {
                            required: 'Este campo es requerido',
                            minLength: { value: 6, message: 'El email debe tener mínimo 6 caracteres'}
                        })}
                        error={ !!errors.password }
                        helperText={ errors.password?.message }
                    />
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            type="submit"
                            color='secondary' 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                        >
                            Registrar
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <NextLink 
                            href={ router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login' }
                            passHref 
                            legacyBehavior
                        >
                            <Link underline='always'>
                                ¿Ya tienes cuenta?
                            </Link>
                        </NextLink>                 
                    </Grid>
                </Grid>
            </Box>

        </form>

    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    //console.log({session});

    const { p = '/' } = query;

    if ( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: { }
    }
}

export default RegisterPage;