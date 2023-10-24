import NextAuth, { Session, User as UserType, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";

export type ExtendedUserType = UserType & { id?: string };
interface CustomProfile extends Profile {
  picture?: string; // Define the 'picture' property
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session }): Promise<Session> {
      const sessionUser = await User.findOne({
        email: session.user?.email,
      });

      (session.user as ExtendedUserType).id = sessionUser._id.toString();

      return session;
    },

    async signIn({ profile }) {
      try {
        await connectToDB();

        const userExists = await User.findOne({ email: profile?.email });

        if (!userExists) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            
            image: (profile as CustomProfile).picture,
            todos: []
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };