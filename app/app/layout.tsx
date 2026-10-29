import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AppSidebar } from "./app-sidebar"
import { ChatProvider } from "./chat-provider"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }

  return (
    <ChatProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        <AppSidebar user={user} />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </ChatProvider>
  )
}
