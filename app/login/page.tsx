import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { auth } from "@/auth"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Faça login no seu painel Spectral AI.",
}

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSafeCallbackUrl(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/app"
  }

  return candidate
}

async function LoginContent({
  searchParams,
}: {
  searchParams: LoginPageProps["searchParams"]
}) {
  await connection()
  const session = await auth()

  if (session?.user) {
    redirect("/app")
  }

  const params = await searchParams

  return <LoginForm callbackUrl={getSafeCallbackUrl(params.callbackUrl)} />
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  )
}
