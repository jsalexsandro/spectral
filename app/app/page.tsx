import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { SignOutButton } from "./sign-out-button"

export const metadata: Metadata = {
  title: "Plataforma",
  description: "Painel do Spectral AI.",
}

async function PlatformContent() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-heading">Platform</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {session.user.name || session.user.email}
        </p>
      </div>

      <SignOutButton />
    </div>
  )
}

function PlatformFallback() {
  return (
    <div className="space-y-4 text-center" aria-hidden>
      <div className="mx-auto h-9 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="mx-auto h-4 w-56 animate-pulse rounded bg-muted" />
      <div className="mx-auto h-9 w-20 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

export default function AppPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Suspense fallback={<PlatformFallback />}>
        <PlatformContent />
      </Suspense>
    </main>
  )
}
