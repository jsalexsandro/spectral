"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowRight, Envelope, Check, CircleNotch, WarningCircle } from "phosphor-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaApple } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_CHECK_DEBOUNCE_MS = 500

type EmailStatus = "idle" | "invalid" | "checking" | "exists" | "not_found" | "error"

export function LoginForm({ callbackUrl = "/app" }: { callbackUrl?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const showPassword = emailStatus === "exists"
  const canSubmit = emailStatus === "exists" && password.length >= 6

  const handleProviderSignIn = useCallback(
    (provider: "google" | "github" | "apple") => {
      setFormError(null)
      void signIn(provider, { callbackUrl })
    },
    [callbackUrl],
  )

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setEmail(value)
    setPassword("")
    setFormError(null)

    if (!value.trim()) {
      setEmailStatus("idle")
      return
    }

    setEmailStatus(EMAIL_REGEX.test(value.trim()) ? "checking" : "invalid")
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!canSubmit || isSubmitting) {
        return
      }

      setIsSubmitting(true)
      setFormError(null)

      try {
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        })

        if (!result || result.error) {
          setFormError("E-mail ou senha incorretos. Tente novamente.")
          setPassword("")
          return
        }

        router.push(callbackUrl)
        router.refresh()
      } catch {
        setFormError("Não foi possível entrar. Tente novamente.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [canSubmit, callbackUrl, email, isSubmitting, password, router],
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
        setEmailStatus(data.exists ? "exists" : "not_found")
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

  return (
    <main className="w-full h-screen flex min-h-full flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-[430px] space-y-4 items-center">
        <div className="text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Bem vindo a Spectral
          </h1>
          <p className="text-muted-foreground">
            Uma nova maneira de controlar seu agentes
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
          <div className="space-y-2 relative">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative group">
              <Envelope
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transition-colors duration-300"
                style={{
                  color:
                    emailStatus === "exists"
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
                autoFocus
                aria-invalid={emailStatus === "invalid"}
                aria-describedby="email-status"
                className={cn(
                  "h-12 pl-11 pr-10 transition-all duration-300",
                  emailStatus === "exists"
                    ? "border-primary ring-3 ring-primary/20 bg-primary/5"
                    : "border-border",
                  emailStatus === "invalid" ? "text-destructive" : "",
                )}
              />
              {emailStatus === "checking" && (
                <CircleNotch className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              {emailStatus === "exists" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-primary animate-check-in">
                  <Check size={20} strokeWidth={2.5} />
                </div>
              )}
              {(emailStatus === "not_found" || emailStatus === "error") && (
                <WarningCircle
                  className={cn(
                    "pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2",
                    emailStatus === "error"
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
                {emailStatus === "exists" && (
                  <p className="text-xs text-primary">
                    E-mail verificado. Informe sua senha.
                  </p>
                )}
                {emailStatus === "not_found" && (
                  <p className="text-xs text-muted-foreground">
                    E-mail não encontrado.{" "}
                    <Link
                      href="/register"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Criar conta
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

          {showPassword && (
            <div
              className="space-y-2 animate-slide-up-fade"
              style={{ animationDelay: "100ms" }}
            >
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFormError(null)
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={6}
                  maxLength={128}
                  className={cn(
                    "h-12 pl-10 transition-all duration-300 border-primary ring-3 ring-primary/20 bg-primary/5 focus:ring-primary/20",
                  )}
                />
                <div className="absolute inset-0 rounded-lg border border-primary/30 pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres.
              </p>
            </div>
          )}

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
                Entrando
                <CircleNotch className="ml-2 size-4 animate-spin" />
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          Não sou cadastrado.{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary/80 underline-offset-4"
          >
            Cadastre-se
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

        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
