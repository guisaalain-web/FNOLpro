import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Demo users for portfolio showcase - no database required
const DEMO_USERS = [
    {
        id: "demo-admin-1",
        email: "admin@fnolpro.com",
        password: "admin123",
        name: "Admin Demo",
        role: "ADMIN",
    },
    {
        id: "demo-client-1",
        email: "cliente@ejemplo.com",
        password: "cliente123",
        name: "Cliente Demo",
        role: "CLIENT",
    },
    {
        id: "demo-client-2",
        email: "demo@demo.com",
        password: "demo",
        name: "Usuario Demo",
        role: "CLIENT",
    },
];

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales inválidas");
                }

                // Find demo user
                const user = DEMO_USERS.find(
                    (u) => u.email === credentials.email && u.password === credentials.password
                );

                if (!user) {
                    throw new Error("Usuario no encontrado. Usa: demo@demo.com / demo");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
};
