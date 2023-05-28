import NextAuth, { type NextAuthOptions, Account, User } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET)
  throw new Error('Failed to initialize Github authentication');

const adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('No credentials found.');
        }

        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return null;
        }

        if (user && user.password === password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
  },
  secret: 'rZTFtfNuSMajLnfFrWT2PZ3lX8WZv7W/Xs2H8hkEY6g=',
  // adapter: PrismaAdapter(prisma),
  // cookies: {
  //   sessionToken: {
  //     name: `${VERCEL_DEPLOYMENT ? '__Secure-' : ''}next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       domain: VERCEL_DEPLOYMENT ? '.vercel.pub' : undefined,
  //       secure: VERCEL_DEPLOYMENT,
  //     },
  //   },
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }
      //@ts-ignore
      if (account.provider === 'email' || account.provider === 'credentials') {
        return true;
      }
      //@ts-ignore
      if (account.provider != 'github' && account.provider != 'google') {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        const linkedAccount = await prisma.account.findFirst({
          where: { userId: existingUser.id },
        });

        if (linkedAccount) {
          return true;
        }
        //@ts-ignore
        await linkAccount(existingUser, account);
      }

      return true;
    },

    async session({ session, token }) {
      if (token && session) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

const linkAccount = async (user: User, account: Account) => {
  return await adapter.linkAccount({
    providerAccountId: account.providerAccountId,
    userId: user.id,
    provider: account.provider,
    type: 'oauth',
    scope: account.scope,
    token_type: account.token_type,
    access_token: account.access_token,
  });
};
