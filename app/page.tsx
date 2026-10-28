import Link from "next/link";
import { ArrowRight, Component, Palette, Sparkles, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const foundations = [
  {
    icon: Palette,
    title: "Cores",
    description: "Branco, off-whites e esmeralda espectral.",
    href: "/styleguide#cores",
  },
  {
    icon: Type,
    title: "Tipografia",
    description: "Geist Sans para interface e Geist Mono para dados.",
    href: "/styleguide#tipografia",
  },
  {
    icon: Component,
    title: "Componentes",
    description: "Primitivos acessíveis construídos com shadcn/ui.",
    href: "/styleguide#componentes",
  },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.16),transparent)] blur-2xl"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 border-primary/20 bg-primary/5 text-primary"
        >
          <Sparkles className="size-3" />
          Passo 1 · Design system
        </Badge>

        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/15">
          <Sparkles className="size-7" />
        </div>

        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Spectral <span className="text-primary">AI</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A base visual do seu novo painel de inteligência artificial. Limpa,
          acessível e pronta para evoluir com o produto.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/styleguide"
            className={buttonVariants({ size: "lg", className: "px-5" })}
          >
            Explorar design system
            <ArrowRight data-icon="inline-end" />
          </Link>
          <span className="text-sm text-muted-foreground">
            Dashboard em construção
          </span>
        </div>

        <div className="mt-14 grid w-full gap-3 sm:grid-cols-3">
          {foundations.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className={cn(
                "group rounded-xl border bg-card p-4 text-left shadow-soft",
                "transition-colors hover:border-primary/30 hover:bg-accent/40",
              )}
            >
              <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <p className="font-heading text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          Spectral Emerald · Geist · shadcn/ui
        </p>
      </div>
    </main>
  );
}
