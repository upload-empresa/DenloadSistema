import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email?: string | null;

      id?: string | null;

      image?: string | null;

      name?: string | null;

      username?: string | null;
    };
  }

  interface User {
    email?: string | null;

    id: string;

    image?: string | null;

    name?: string | null;

    username?: string | null;
  }
}
