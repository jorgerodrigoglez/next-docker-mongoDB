import { FC, useReducer, ReactNode, useEffect } from "react";
import axios from "axios";
import { tesloApi } from "@/apijrg";
import Cookie from 'js-cookie';
import { CartContext, cartReducer } from "./";
import { ICartProduct } from "@/interfacesjrg";
import { IOrder, ShippingAddress } from "@/interfaces/orderjrg";

type PropsWithChildren = {
    children: ReactNode
}

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[],
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    // soluciona que no se borren la cookies al reiniciar el navegador
    //cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],

    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

export const CartProvider:FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE );

    // leer los productos de las cookies
    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
    }, []);
    

    // almacenar carrito en cookies
    useEffect(() => {
        if (state.cart.length > 0 ) Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    // total quantity products
    useEffect(() => {
        const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev , 0 );
        const subTotal = state.cart.reduce(( prev, current ) => (current.quantity * current.price) + prev , 0 );
        const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax : subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        //console.log({orderSummary})
        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
       
    }, [state.cart]);

    // cargar informacion de cookies en checkout/address
    useEffect(() => {

        if ( Cookie.get('firstName')){
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || '',
                phone: Cookie.get('phone') || '',
            }
            
            dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: shippingAddress })
        }
    }, [])

    const addProductToCart = ( product: ICartProduct ) => {
        //* Nivel 1
        //dispatch({ type: '[Cart] - Add product', payload: product });
        //* Nivel 2
        //const productInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
        //dispatch({ type: '[Cart] - Add product', payload: [ ...productInCart, product ] });
        //* Solución final
        // diferente id - añadimos
        const productInCart = state.cart.some( p => p._id === product._id );
        if(!productInCart) return dispatch({ type: '[Cart] - Update product in cart', payload: [ ...state.cart, product ] });
        // diferente talla - añadimos
        const productInCartByDifferenceSize = state.cart.some( p => p._id === product._id && p.size === product.size );
        if(!productInCartByDifferenceSize) return dispatch({ type: '[Cart] - Update product in cart', payload: [ ...state.cart, product ] });
        // igual is y talla acomulamos
        const updateProducts = state.cart.map( p => {
            if(p._id !== product._id) return p;
            if(p.size !== product.size) return p;
            // actalizar la cantidad
            p.quantity += product.quantity;

            return p;
        });

        dispatch({ type: '[Cart] - Update product in cart', payload: updateProducts });
  
    }

    // modificar la cantidad de producto en el carrito
    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change product quantity in cart', payload: product });
    }

    // eliminar un producto del carrito
    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    }

    // actualizar datos de dirección
    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName',address.firstName);
        Cookie.set('lastName',address.lastName);
        Cookie.set('address',address.address);
        Cookie.set('address2',address.address2 || '');
        Cookie.set('zip',address.zip);
        Cookie.set('city',address.city);
        Cookie.set('country',address.country);
        Cookie.set('phone',address.phone);

        dispatch({ type: '[Cart] - Update address', payload: address });
    }

    // Orders
    const createOrder = async():Promise<{ hasError: boolean, message: string }> => {

        if( !state.shippingAddress ){
            throw new Error('No existe dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        }

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);
            console.log({data});

            dispatch({ type: '[Cart] - Order complete' });
            // setea las cookies del carrito, ya que el useEffect lo vuelve a cargar
            Cookie.set("cart", JSON.stringify([]));

            return{
                hasError: false,
                message: data._id!
            }
        } catch (error) {
            if( axios.isAxiosError(error) ){
                return{
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return{
                hasError: true,
                message: 'Error no identificado, contacte con el administrador'
            }
        }
    }

    return(
        <CartContext.Provider value={{
            ...state,
            // methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
            // Orders
            createOrder
        }}>
            { children }
        </CartContext.Provider>
    )
}