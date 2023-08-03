import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShopLayout } from "@/components/layoutsjrg";
import { useForm } from "react-hook-form";
import Cookie from "js-cookie";
//import { GetServerSideProps } from "next";
import { FormControl, Grid, Select, TextField, Typography, MenuItem, Box, Button} from "@mui/material";
//import { jwt } from "@/utilsjrg";
import { CartContext } from '@/contextjrg';
import { countries } from "@/utilsjrg";

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = ():FormData => {
    return {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
    }
}


export const AddressPage = () => {

    const router = useRouter();
    const { updateAddress } = useContext(CartContext);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: '',
            phone: '',
        } 
     });

     useEffect(() => {
        reset( getAddressFromCookies() );
     }, [reset])
     

    const onSubmitAddress = ( data: FormData ) => {
        //console.log(data);
        updateAddress( data );
        router.push('/checkout/summary');
    }

  return (
    <ShopLayout title="Dirección" pageDescription={"Confirmar dirección de destino"}>
        <form onSubmit={ handleSubmit( onSubmitAddress ) }>

            <Typography variant="h1" component="h1">Dirección</Typography>

            <Grid container spacing="2" sx={{ mt: 2 }} >
                <Grid item xs={12} sm={6} >
                    <TextField 
                        label="Nombre" 
                        variant="filled" 
                        fullWidth
        
                        { ...register('firstName', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.firstName }
                        helperText={ errors.firstName?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Apellido" 
                        variant="filled" 
                        fullWidth 
                        { ...register('lastName', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Dirección" 
                        variant="filled" 
                        fullWidth 
                        { ...register('address', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.address }
                        helperText={ errors.address?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Dirección 2 (opcional)"  
                        variant="filled" 
                        fullWidth 
                        { ...register('address2')}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Codigo postal" 
                        variant="filled" 
                        fullWidth
                        { ...register('zip', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Ciudad" 
                        variant="filled" 
                        fullWidth 
                        { ...register('city', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.city }
                        helperText={ errors.city?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    {/*<FormControl fullWidth>*/}
                        <TextField
                            // select
                            variant='filled'
                            label='País'
                            fullWidth
                            //defaultValue={ Cookie.get('country') || countries[0].code }
                            { ...register('country', {
                                required: 'Este campo es requerido'
                            })}
                            error={ !!errors.country }
                            helperText={ errors.country?.message }
                        />
                            {/*{
                                countries.map(country => (
                                    <MenuItem 
                                        key={country.code}
                                        value={country.code}
                                    >
                                        {country.name}
                                    </MenuItem>
                                
                                ))
                            }
                        </TextField> */}
                    {/*</FormControl>*/}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Teléfono" 
                        variant="filled" 
                        fullWidth 
                        { ...register('phone', {
                            required: 'Este campo es requerido'
                        })}
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }
                    />
                    
                </Grid>

            </Grid>

            <Box sx={{ mt:5 }} display="flex" justifyContent="center">
                <Button 
                    type='submit'
                    color="secondary" 
                    className="circular-btn" 
                    size="large"
                >
                    Revisar pedido
                </Button>
            </Box>
        
        </form>
        
    </ShopLayout>
  )
}

/*export const getServerSideProps: GetServerSideProps = async({req}) => {

    const { token = '' } = req.cookies;
    let isValidToken = false;

    try {
        await jwt.isValidToken( token );
        isValidToken = true;
    } catch (error) {
        isValidToken = false;
    }

    if( !isValidToken ){
        return{
            redirect:{
                destination: '/auth/login?p=/checkout/address',
                permanent: false
            }
        }
    }

    return{
        props:{

        }
    }

}*/

export default AddressPage
