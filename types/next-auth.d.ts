import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      nickname?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    nickname?: string | null
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    nickname?: string | null
  }
}
