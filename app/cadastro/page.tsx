import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta no Spectral AI.",
}

async function RegisterContent() {
  const session = await auth()

  if (session?.user) {
    redirect("/app")
  }

  return <RegisterForm />
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterForm />}>
      <RegisterContent />
    </Suspense>
  )
}
