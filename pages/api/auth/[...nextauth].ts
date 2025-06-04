import {PrismaAdapter} from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name:'credentials',
            credentials:{
                email:{label:'email', type:'text'},
                password:{label:'password', type:'password'},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Invalid credentials");
                }
            
                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });

                if(!user || !user?.hashedPassword){
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if(!isCorrectPassword){
                    throw new Error('Invalid credentials');
                }

                return user;
            }
        })
    ],
    pages:{
        signIn:'/',
    },
    debug: true,
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
};

export default NextAuth(authOptions)