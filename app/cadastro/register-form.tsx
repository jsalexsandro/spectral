"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowRight, CircleNotch } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FieldErrors = Partial<Record<"name" | "email" | "password", string[]>>

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (isSubmitting) {
        return
      }

      setIsSubmitting(true)
      setFormError(null)
      setFieldErrors({})

      const normalizedEmail = email.trim().toLowerCase()

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: normalizedEmail, password }),
        })

        const data = (await response.json()) as {
          error?: string
          issues?: FieldErrors
        }

        if (!response.ok) {
          if (data.error === "email_in_use") {
            setFormError("Este e-mail já está cadastrado.")
            return
          }

          if (data.issues) {
            setFieldErrors(data.issues)
            setFormError("Revise os campos destacados.")
            return
          }

          setFormError("Não foi possível criar a conta. Tente novamente.")
          return
        }

        const result = await signIn("credentials", {
          email: normalizedEmail,
          password,
          redirect: false,
        })

        if (!result || result.error) {
          router.push("/login")
          return
        }

        router.push("/app")
        router.refresh()
      } catch {
        setFormError("Não foi possível criar a conta. Tente novamente.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [email, isSubmitting, name, password, router],
  )

  return (
    <main className="w-full h-screen flex min-h-full flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-[430px] space-y-4">
        <div className="text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Criar conta
          </h1>
          <p className="text-muted-foreground">
            Comece a usar o Spectral AI em poucos segundos.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              autoFocus
              aria-invalid={Boolean(fieldErrors.name)}
              className="h-12"
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              autoComplete="email"
              maxLength={254}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              className="h-12"
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              required
              aria-invalid={Boolean(fieldErrors.password)}
              className="h-12"
            />
            {fieldErrors.password ? (
              <p className="text-xs text-destructive">
                {fieldErrors.password[0]}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres.
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-xs text-destructive">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-emerald-900/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Criando conta
                <CircleNotch className="ml-2 size-4 animate-spin" />
              </>
            ) : (
              <>
                Criar conta
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          Já tenho uma conta.{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary/80 underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
