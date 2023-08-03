import { ICartProduct, ShippingAddress } from '@/interfacesjrg';
import { CartState } from './';

type CartActionType = 
| {type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[]} 
| {type: '[Cart] - Update product in cart', payload: ICartProduct[]} 
| {type: '[Cart] - Change product quantity in cart', payload: ICartProduct} 
| {type: '[Cart] - Remove product in cart', payload: ICartProduct} 
| {type: '[Cart] - LoadAddress from Cookies', payload: ShippingAddress}
| {type: '[Cart] - Update address', payload: ShippingAddress}
| {
    type: '[Cart] - Update order summary', 
    payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
    }
  } 
| {type: '[Cart] - Order complete'}

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {
    
    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return{
                ...state,
                isLoaded: true,
                cart: action.payload
            }
        case '[Cart] - Update product in cart':
            return{
                ...state,
                //cart : [ ...state.cart, action.payload ],
                cart: [ ...action.payload ]
                
            }
        case '[Cart] - Change product quantity in cart':
            return{
                ...state,
                cart: state.cart.map( product => {
                    if(product._id !== action.payload._id) return product;
                    if(product.size !== action.payload.size) return product;

                    //product.quatity = action.payload.quantity;
                    //return product;
                    return action.payload;
                })
                
            }
        case '[Cart] - Remove product in cart':
            return{
                ...state,
                /*cart: state.cart.filter( 
                    product => !(
                        product._id === action.payload._id && product.size === action.payload.size
                    ))*/
                cart: state.cart.filter( product => {
                    if(product._id === action.payload._id && product.size === action.payload.size){
                        return false;
                    }else{
                        return true;
                    }
                })
            }
        case '[Cart] - Update order summary':
            return{
                ...state,
                ...action.payload
            }
        case '[Cart] - Update address':
        case '[Cart] - LoadAddress from Cookies':
         return {
            ...state,
            shippingAddress: action.payload
         }
         case '[Cart] - Order complete':
            return{
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0,
            }
        default:
            return state;
    }
}