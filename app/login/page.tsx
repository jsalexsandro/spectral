"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, Envelope, Check } from "phosphor-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaApple } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  const emailValid = EMAIL_REGEX.test(email)

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (EMAIL_REGEX.test(e.target.value) && !showPassword) {
      setShowPassword(true)
    }
  }, [showPassword])

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
            onClick={() => {
              // Implementar login com Apple
            }}
            aria-label="Continuar com Apple"
          >
            <FaApple className="size-7" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-26 px-0 flex items-center justify-center"
            onClick={() => {
              // Implementar login com Google
            }}
            aria-label="Continuar com Google"
          >
            <FcGoogle className="size-7" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-26 px-0 flex items-center justify-center"
            onClick={() => {
              // Implementar login com Github
            }}
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

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2 relative">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative group">
              <Envelope
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transition-colors duration-300"
                style={{ color: emailValid ? "oklch(0.508 0.118 165.612)" : "oklch(0.48 0.02 165)" }}
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="voce@empresa.com"
                className={cn(
                  "h-12 pl-11 pr-10 transition-all duration-300",
                  emailValid
                    ? "border-primary ring-3 ring-primary/20 bg-primary/5"
                    : "border-border",
                  email && !emailValid ? "text-destructive" : "",
                )}
              />
              {emailValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-primary animate-check-in">
                  <Check size={20} strokeWidth={2.5} />
                </div>
              )}
            </div>
            {email && !emailValid && (
              <p className="text-xs text-destructive animate-shake">
                Informe um e-mail válido.
              </p>
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full h-12 transition-all duration-300",
              emailValid && showPassword
                ? "bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-emerald-900/20"
                : "bg-muted/50 text-muted-foreground opacity-60 cursor-not-allowed",
            )}
            disabled={!emailValid || !showPassword || !password}
          >
            Continuar
            <ArrowRight className="ml-2 size-4 data-icon=[inline-end]:animate-slide-right" />
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          Não sou cadastrado.{" "}
          <Link
            href="/cadastro"
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

        @keyframes pingSm {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-sm {
          animation: pingSm 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes slideRight {
          0% { transform: translateX(0); }
          50% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        .data-icon\\[inline-end\\]:animate-slide-right {
          animation: slideRight 0.6s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
