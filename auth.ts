import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "user", ...(profile as any) }
      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      console.log(token.email, 'role:', token.role)
      if(token.email == 'sahilmetalwala@gmail.com') token.role = 'admin' // crude but I cannot set user roles on github
      if(user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      (session.user as any).role = token.role;
      return session
    },
    // authorized: async ({ auth }) => {
    //   // Logged in users are authenticated, otherwise redirect to login page
    //   return !!auth
    // },
  }
})