"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  ArrowRight,
  Envelope,
  User,
  Check,
  CircleNotch,
  WarningCircle,
} from "phosphor-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaApple } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { registerSchema } from "@/lib/validations/auth"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_CHECK_DEBOUNCE_MS = 500

type EmailStatus = "idle" | "invalid" | "checking" | "taken" | "available" | "error"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

export function RegisterForm({ callbackUrl = "/app" }: { callbackUrl?: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const canSubmit =
    emailStatus === "available" &&
    Object.keys(validateFields(name, email, password)).length === 0

  const handleProviderSignIn = useCallback(
    (provider: "google" | "github" | "apple") => {
      setFormError(null)
      void signIn(provider, { callbackUrl })
    },
    [callbackUrl],
  )

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setFormError(null)
    setFieldErrors((prev) => ({ ...prev, name: undefined }))
  }, [])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setEmail(value)
    setFormError(null)
    setFieldErrors((prev) => ({ ...prev, email: undefined }))

    if (!value.trim()) {
      setEmailStatus("idle")
      return
    }

    setEmailStatus(EMAIL_REGEX.test(value.trim()) ? "checking" : "invalid")
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFormError(null)
    setFieldErrors((prev) => ({ ...prev, password: undefined }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!canSubmit || isSubmitting) {
        return
      }

      setIsSubmitting(true)
      setFormError(null)

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (response.status === 409) {
          setEmailStatus("taken")
          setFormError("Este e-mail já está cadastrado.")
          setIsSubmitting(false)
          return
        }

        const data = (await response.json()) as {
          error?: string
          issues?: FieldErrors
        }

        if (!response.ok) {
          if (data.error === "invalid_payload" && data.issues) {
            setFieldErrors(data.issues)
            setFormError("Revise os campos destacados.")
          } else {
            setFormError("Não foi possível criar a conta. Tente novamente.")
          }
          setIsSubmitting(false)
          return
        }

        const result = await signIn("credentials", {
          email: payload.email,
          password: payload.password,
          redirect: false,
        })

        if (!result || result.error) {
          router.push("/login")
          return
        }

        router.push(callbackUrl)
        router.refresh()
      } catch {
        setFormError("Não foi possível criar a conta. Tente novamente.")
        setIsSubmitting(false)
      }
    },
    [canSubmit, callbackUrl, email, isSubmitting, name, password, router],
  )

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return
    }

    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Email check failed with status ${response.status}`)
        }

        const data = (await response.json()) as { exists?: boolean }
        setEmailStatus(data.exists ? "taken" : "available")
      } catch {
        if (!controller.signal.aborted) {
          setEmailStatus("error")
        }
      }
    }, EMAIL_CHECK_DEBOUNCE_MS)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [email])

  const errors = validateFields(name, email, password)

  return (
    <main className="w-full h-screen flex min-h-full flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-[430px] space-y-4 items-center">
        <div className="text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-muted-foreground">
            Comece a controlar seus agentes na Spectral
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-26 px-0 flex items-center justify-center"
            onClick={() => handleProviderSignIn("apple")}
            aria-label="Continuar com Apple"
          >
            <FaApple className="size-7" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-26 px-0 flex items-center justify-center"
            onClick={() => handleProviderSignIn("google")}
            aria-label="Continuar com Google"
          >
            <FcGoogle className="size-7" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-26 px-0 flex items-center justify-center"
            onClick={() => handleProviderSignIn("github")}
            aria-label="Continuar com Github"
          >
            <FaGithub className="size-7" />
          </Button>
        </div>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="mx-3 bg-background px-1 text-xs font-medium text-muted-foreground">
            ou
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Seu nome"
                autoComplete="name"
                autoFocus
                aria-invalid={Boolean(errors.name || fieldErrors.name)}
                className={cn(
                  "h-12 pl-11 transition-all duration-300",
                  (errors.name || fieldErrors.name) &&
                    "border-destructive text-destructive",
                )}
              />
            </div>
            {(errors.name || fieldErrors.name) && (
              <p role="alert" className="text-xs text-destructive animate-shake">
                {fieldErrors.name ?? errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative group">
              <Envelope
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transition-colors duration-300"
                style={{
                  color:
                    emailStatus === "available"
                      ? "oklch(0.508 0.118 165.612)"
                      : "oklch(0.48 0.02 165)",
                }}
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="voce@empresa.com"
                autoComplete="email"
                aria-invalid={emailStatus === "invalid" || emailStatus === "taken"}
                aria-describedby="email-status"
                className={cn(
                  "h-12 pl-11 pr-10 transition-all duration-300",
                  emailStatus === "available"
                    ? "border-primary ring-3 ring-primary/20 bg-primary/5"
                    : "border-border",
                  emailStatus === "invalid" || emailStatus === "taken"
                    ? "text-destructive"
                    : "",
                )}
              />
              {emailStatus === "checking" && (
                <CircleNotch className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              {emailStatus === "available" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-primary animate-check-in">
                  <Check size={20} strokeWidth={2.5} />
                </div>
              )}
              {(emailStatus === "taken" ||
                emailStatus === "invalid" ||
                emailStatus === "error") && (
                <WarningCircle
                  className={cn(
                    "pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2",
                    emailStatus === "error" || emailStatus === "taken"
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                />
              )}
            </div>
            {emailStatus !== "idle" && (
              <div id="email-status" role="status" aria-live="polite">
                {emailStatus === "invalid" && (
                  <p className="text-xs text-destructive animate-shake">
                    Informe um e-mail válido.
                  </p>
                )}
                {emailStatus === "checking" && (
                  <p className="text-xs text-muted-foreground">
                    Verificando e-mail...
                  </p>
                )}
                {emailStatus === "available" && (
                  <p className="text-xs text-primary">E-mail disponível.</p>
                )}
                {emailStatus === "taken" && (
                  <p className="text-xs text-destructive">
                    E-mail já cadastrado.{" "}
                    <Link
                      href="/login"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Entrar
                    </Link>
                  </p>
                )}
                {emailStatus === "error" && (
                  <p className="text-xs text-destructive">
                    Não foi possível verificar o e-mail. Tente novamente.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              aria-invalid={Boolean(errors.password || fieldErrors.password)}
              className={cn(
                "h-12 transition-all duration-300",
                (errors.password || fieldErrors.password) &&
                  "border-destructive text-destructive",
              )}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo de 6 caracteres.
            </p>
            {(errors.password || fieldErrors.password) && (
              <p role="alert" className="text-xs text-destructive animate-shake">
                {fieldErrors.password ?? errors.password}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-xs text-destructive animate-shake">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full h-12 transition-all duration-300",
              canSubmit && !isSubmitting
                ? "bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-emerald-900/20"
                : "bg-muted/50 text-muted-foreground opacity-60 cursor-not-allowed",
            )}
            disabled={!canSubmit || isSubmitting}
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
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary/80 underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes checkIn {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-45deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-check-in {
          animation: checkIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </main>
  )
}

function validateFields(name: string, email: string, password: string): FieldErrors {
  const parsed = registerSchema.safeParse({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  })

  if (parsed.success) {
    return {}
  }

  const flattened = parsed.error.flatten().fieldErrors

  return {
    name: flattened.name?.[0],
    email: flattened.email?.[0],
    password: flattened.password?.[0],
  }
}
