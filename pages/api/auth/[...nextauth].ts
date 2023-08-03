import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "@/databasejrg";
import { IUser } from "@/interfacesjrg";

declare module "next-auth" {
  interface Session {
    user: IUser;
    accessToken?: string;
  }

  interface User {
      id?: string;
      _id: string;
  }

};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
  
    // ...add more providers here
    Credentials({
        name: 'Custom Login',
        credentials: {
            email: { label: 'Correo:', type: 'text', placeholder: 'correo@gmail.com' },
            password: { label: 'Contraseña:', type: 'password', placeholder: 'contraseña' },
        },
        async authorize(credentials){
            //console.log({credentials});
            //return { name: 'Jorge', correo: 'jorge@gmail.com', role: 'admin' };

            return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );

        }
    }),

    GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
      }),

  ],

  // custom pages
  pages: {
    signIn : '/auth/login',
    newUser: '/auth/register'
  },

  
  // Callbacks
  jwt:{
    //secret: process.env.JWT_SECRET_SEED, // DEPRECATTED
  },
  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400 // cada dia
  },
  callbacks: {

    async jwt({ token, account, user }){
        //console.log({token, account, user});
        if( account ){
            token.accessToken = account.access_token;

            switch (account.type) {
                case 'oauth':
                    // crear usuario o verificar si existe en la BBDD
                    token.user = await dbUsers.onAuthToDbUser( user?.email || '' , user?.name || '' );
                break;

                case 'credentials':
                    token.user = user;
                break;
            }
        }

        return token;
    },

    async session({ session, token, user }){
        //console.log({ session, token, user });
        session.accessToken = token.access_token as any;
        session.user = token.user as any;

        return session;
    }
  }
}

export default NextAuth(authOptions);