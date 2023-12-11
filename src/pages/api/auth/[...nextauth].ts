import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../database/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Fetch additional user data from your database using the provided token

      const client = await pool.connect();
      const result = await client.query<User>(
        "SELECT * FROM users WHERE email = $1",
        [session.user.email]
      );
      client.release();

      const userData = result.rows[0];

      // Extend the session object with additional properties

      session.user.id = userData.id;
      session.user.username = userData.username;
      session.user.email = userData.email;
      session.user.role = userData.role;
      console.log(session);
      return Promise.resolve(session);
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials: Record<string, string>, req) {
        const { email, password } = credentials;
        const client = await pool.connect();
        const result = await client.query<User>(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        client.release();
        const user = result.rows[0];

        if (!user) throw new Error("Invalid Email or Password");

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) throw new Error("Invalid Email or Password");
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
