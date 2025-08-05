import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Organisation } from "@/types";
import OrganisationMemberModel from "./models/OrganisationMember";
import UserModel from "./models/User";
import dbConnect from "./mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email });
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id?.toString() || "",
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        await dbConnect();

        const dbUser = await UserModel.findById(token.id);
        if (dbUser) {
          session.user.id = dbUser._id?.toString() || "";

          const memberships = await OrganisationMemberModel.find({
            userId: dbUser._id,
          })
            .populate("organisationId")
            .lean();

          const organisations = memberships.map((membership) => {
            const org = membership.organisationId as unknown as Organisation;
            return {
              ...org,
              role: membership.role,
            };
          }) as SessionOrganisation[];

          session.user.organisations = organisations;
          session.user.settings = dbUser.settings;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

interface SessionOrganisation {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  settings: {
    timeFormat: "12h" | "24h";
    currency: string;
    weekStart: "monday" | "sunday";
    categories: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      organisations: SessionOrganisation[];
      settings: {
        defaultView: "timer" | "dashboard";
        timeFormat: "12h" | "24h";
        weekStart: "monday" | "sunday";
      };
    };
  }
}
