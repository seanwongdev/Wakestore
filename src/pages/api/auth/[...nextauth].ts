import NextAuth, { Session, User, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../database/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions = {
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Fetch additional user data from your database using the provided token
      try {
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
        session.user.image = userData.img_url;

        return session;
      } catch (err) {
        console.error("Error in session callback:", err);
        throw err;
      }
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "text",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials?: Record<string, string>) {
        try {
          if (!credentials) {
            throw new Error("Missing credentials");
          }
          const { email, password } = credentials;
          const client = await pool.connect();
          const result = await client.query<User>(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );
          client.release();
          const user = result.rows[0];

          if (!user) throw new Error("Invalid Email or Password");

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password || ""
          );

          if (!isPasswordMatched) throw new Error("Invalid Email or Password");

          return user;
        } catch (err) {
          console.error("Error in authorize:", err);
          throw err;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);

export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.role !== "admin") {
    res
      .status(403)
      .json({ error: "You need to be an Admin to access this page" });
    throw Error("You need to be an Admin to access this page");
  }
}
