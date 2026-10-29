import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { auth } from "@/auth"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta no Spectral AI.",
}

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSafeCallbackUrl(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/app"
  }

  return candidate
}

async function RegisterContent({
  searchParams,
}: {
  searchParams: RegisterPageProps["searchParams"]
}) {
  await connection()
  const session = await auth()

  if (session?.user) {
    redirect("/app")
  }

  const params = await searchParams

  return <RegisterForm callbackUrl={getSafeCallbackUrl(params.callbackUrl)} />
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <Suspense fallback={<RegisterForm />}>
      <RegisterContent searchParams={searchParams} />
    </Suspense>
  )
}
