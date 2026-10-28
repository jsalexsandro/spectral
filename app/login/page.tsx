"use client"

import Link from "next/link"
import { ArrowRight, Envelope, GlobeSimple, GitBranch } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-12">
        <div className="space-y-2 text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Bem vindo a Spectral
          </h1>
          <p className="text-muted-foreground">
            Uma nova maneira de controlar seu agentes
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 px-4"
            onClick={() => {
              // Implementar login com Google
            }}
          >
            <GlobeSimple className="mr-3 size-5" data-icon="inline-start" />
            Continuar com o Google
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 px-4"
            onClick={() => {
              // Implementar login com GitHub
            }}
          >
            <GitBranch className="mr-3 size-5" data-icon="inline-start" />
            Continuar com GitHub
          </Button>
        </div>

        <div className="relative flex items-center space-y-0">
          <div className="flex-1 border-t border-border" />
          <span className="mx-3 bg-background px-1 text-xs font-medium text-muted-foreground">
            ou
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Envelope
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com"
                className={cn(
                  "h-12 pl-11",
                  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                )}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-12">
            Continuar com e-mail
            <ArrowRight className="ml-2 size-5" data-icon="inline-end" />
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
    </main>
  )
}
