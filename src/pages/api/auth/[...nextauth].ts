import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../database/db";
import bcrypt from "bcryptjs";

interface User {
  email: string;
  password: string;
}

export const authOptions = {
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
