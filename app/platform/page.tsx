import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PlatformPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-heading">Platform</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {session.user.name || session.user.email}
        </p>
      </div>
    </main>
  )
}
