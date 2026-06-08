import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/x-admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      const adminEmails = [
        "admin@mahaproperties.com",
        "rautraynikhil6@gmail.com",
      ];
      return user.email ? adminEmails.includes(user.email) : false;
    },
  },
});

export { handler as GET, handler as POST };