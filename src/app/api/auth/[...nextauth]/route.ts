import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getDb } from "@/lib/db";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const sql = getDb();
      const githubId = String((profile as Record<string, unknown>)?.id ?? user.id);
      const username = (profile as Record<string, unknown>)?.login as string ?? user.name ?? "unknown";
      const avatarUrl = user.image ?? "";

      await sql`
        INSERT INTO users (github_id, username, avatar_url)
        VALUES (${githubId}, ${username}, ${avatarUrl})
        ON CONFLICT (github_id)
        DO UPDATE SET username = ${username}, avatar_url = ${avatarUrl}
      `;

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        const sql = getDb();
        const rows = await sql`
          SELECT id, username, github_id FROM users WHERE github_id = ${token.sub}
        `;
        if (rows.length > 0) {
          (session as unknown as Record<string, unknown>).userId = rows[0].id;
          (session as unknown as Record<string, unknown>).username = rows[0].username;
        }
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.sub = String((profile as Record<string, unknown>).id);
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
