
import { useState, useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AuthLayout } from "@/components/layoutsjrg";
import { Box, Grid, TextField, Typography, Button, Link, Chip, Divider } from "@mui/material";
//import { AuthContext } from '@/contextjrg';
import { useForm } from 'react-hook-form';
import { validations } from '@/utilsjrg';
//import { tesloApi } from '@/apijrg';

type FormData = {
    email: string,
    password: string,
};


const LoginPage = () => {

    //const { loginUser } = useContext( AuthContext );
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    //console.log({errors});
    const [showError, setShowError] = useState(false);
    // providers next auth
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then( prov => {
            //console.log({prov});
            setProviders(prov);
        })
    }, [])
    

    const onLoginUser = async( { email, password }: FormData ) => {
        //console.log({data});
        setShowError(false);

        //-------- se sustituye cuando se realice el login con next-auth
        /*const isValidLogin = await loginUser( email, password );
        if(!isValidLogin){
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }
        // navegar a la pantalla en la que se encontraba el usuario
        const destination = router.query.p?.toString() || '/';
        router.replace(destination);*/
        //-------- 

        // Next Auth
        await signIn('credentials', { email, password });

        /*try {
            setShowError(false);
            const { data } = await tesloApi.post('/user/login', {email, password} );
            const { token, user } = data;
            //console.log({token,user});

        } catch (error) {
            console.log('Error en las credenciales');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }*/


    } 

  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={handleSubmit(onLoginUser)} noValidate >

            <Box sx={{ width: 350, padding:'10px 20px', mt:10 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Ingresar</Typography>
                        <Chip
                            label="El Email o la Contraseña del usuario no son validos"
                            color="error"
                            className="fadeIn"
                            sx={{ display: showError ? 'flex' : 'none', mt:1, mb:1}}
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
                            disabled={showError}
                        >
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink 
                            href={ router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register' } 
                            passHref 
                            legacyBehavior
                        >
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>                 
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{ width: '100%', mb: 2 }}/>
                        {
                            Object.values( providers ).map(( provider: any) => {

                                if(provider.id === 'credentials') return (<div key="credentials"></div>);

                                return(
                                    <Button
                                        key={provider.id}
                                        variant='outlined'
                                        fullWidth
                                        color="primary"
                                        sx={{ mb: 1 }}
                                        onClick={ () => signIn( provider.id ) }
                                    >
                                        {provider.name}
                                    </Button>
                                )

                            })
                        }
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

export default LoginPage;