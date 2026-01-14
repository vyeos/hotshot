import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          // custom fields
          daily_allowance: 20,
          energy: 20,
          isVirgin: false,
        };
      },
    }),
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // custom fields
          daily_allowance: 20,
          energy: 20,
          isVirgin: false,
        };
      },
    }),
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
          username: params.username as string,
          // custom fields
          daily_allowance: 20,
          energy: 20,
          isVirgin: false,
        };
      },
    }),
  ],
});