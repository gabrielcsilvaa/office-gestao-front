import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: { signIn: "/" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const body = {
          api_token: process.env.API_TOKEN?.trim(),
          user: credentials.email,
          password: credentials.password,
        };

        // Use absolute URL for server-side fetch
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
        if (dataResponse.result == true) {
          return {
            id: dataResponse.user.ID,
            name: dataResponse.user.NOME,
            email: dataResponse.user.EMAIL,
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
