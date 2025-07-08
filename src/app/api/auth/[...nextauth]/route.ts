import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Definindo a interface para o User retornado por authorize
interface CustomUser {
  id: string;
  name: string;
  email: string;
  tipo: number | null | undefined;
}

// Definindo a interface para o Token usado no callback jwt
interface CustomToken extends JWT {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  tipo?: number | null | undefined;
  [key: string]: unknown; // Adiciona assinatura de índice para compatibilidade com JWT
}

// Definindo a interface para a Session usada no callback session
interface CustomSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    tipo: number;
  } & {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const body = {
          api_token: process.env.API_TOKEN?.trim(),
          user: credentials.email,
          password: credentials.password,
        };

        const baseUrl = process.env.LOCAL_API_URL || "http://localhost:8000";
        const response = await fetch(`${baseUrl}/login/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const dataResponse = await response.json();
        if (dataResponse.result === true) {
          return {
            id: String(dataResponse.user.ID ?? ""),
            name: dataResponse.user.NOME ?? null,
            email: dataResponse.user.EMAIL ?? null,
            tipo: dataResponse.user.TIPO ?? null,
          } as User;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: CustomToken; user?: CustomUser }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.tipo = user.tipo;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomToken }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.tipo = token.tipo ?? 0;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };