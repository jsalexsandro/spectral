import type { Metadata } from "next"
import { auth } from "@/auth"
import { Chat } from "@/components/chat/chat"

export const metadata: Metadata = {
  title: "Plataforma",
  description: "Painel do Spectral AI.",
}

export default async function AppPage() {
  const session = await auth()
  const user = session?.user

  const firstName =
    user?.name?.trim().split(" ")[0] || user?.email?.split("@")[0] || ""

  return <Chat greeting={`Olá, ${firstName}!`} />
}
