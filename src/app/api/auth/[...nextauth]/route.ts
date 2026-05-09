import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Auth attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        if (credentials.password !== "password") {
          console.log("Invalid password");
          return null;
        }

        try {
          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("Creating new user for:", credentials.email);
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split("@")[0],
              },
            });
            console.log("User created with ID:", user.id);
          } else {
            console.log("Existing user found with ID:", user.id);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Database error during authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
