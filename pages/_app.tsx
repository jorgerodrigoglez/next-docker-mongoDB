
// styles
import '../styles/globals.css';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { lightTheme } from '../themes/light-theme';
import { ThemeProvider, CssBaseline } from '@mui/material'
// SWR
import { SWRConfig } from 'swr';
// context
import { AuthProvider, CartProvider, UiProvider } from '@/contextjrg';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id' : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>

        <SWRConfig 
          value={{
            //refreshInterval: 500,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={ lightTheme }>
                  <CssBaseline/>
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>

        </SWRConfig>

      </PayPalScriptProvider>

    </SessionProvider>
  )
}
