// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔵 Sign in attempt:", user?.email);
      console.log("🔵 Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);
      console.log("🔵 Google Secret exists:", !!process.env.GOOGLE_CLIENT_SECRET);
      
      // Add your admin emails here
      const adminEmails = [
        "admin@mahaproperties.com",
        "rautraynikhil6@gmail.com",
          "rautraynikhil6@gmail.com",    // ← Add this
        "rautraynikhilll@gmail.com",   // Add your email here
        // Add more admin emails as needed
      ];
      
      // Allow only admin emails
      if (user?.email && adminEmails.includes(user.email)) {
        console.log("✅ Admin access granted:", user.email);
        return true;
      }
      
      console.log("❌ Access denied:", user?.email);
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/x-admin/login",      // Updated to x-admin
    error: "/x-admin/login",       // Updated to x-admin
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };