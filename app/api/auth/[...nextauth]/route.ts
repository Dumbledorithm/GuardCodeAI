import NextAuth, { NextAuthOptions, Account, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // ACTION: Explicitly request email scope in addition to repo access.
          scope: "repo read:user user:email",
        },
      },
      // ACTION: Add the profile callback for robust mapping of user data.
      profile(profile: any) {
        // This log will appear in your SERVER terminal when a user signs in.
        // It helps you see exactly what data GitHub is providing.
        console.log("GitHub Profile Data Received:", profile);
        
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User; account: Account | null }): Promise<JWT> {
        if (account) {
            token.accessToken = account.access_token;
        }
        // When the user first signs in, the 'user' object from the profile callback is available.
        // We persist the email to the token here.
        if (user) {
            token.id = user.id;
            token.email = user.email;
        }
        return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
        // The token now reliably contains the email.
        // We add it to the session object so it's available in our API routes.
        if (session.user) {
            session.user.email = token.email;
            (session as any).accessToken = token.accessToken;
        }
        return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }