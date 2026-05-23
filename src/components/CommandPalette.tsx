"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const NAV_ITEMS = [
  { label: "Nosotros",  href: "#nosotros",  hint: "Quiénes somos" },
  { label: "Miembros",  href: "#miembros",  hint: "Quiénes están construyendo" },
  { label: "Eventos",   href: "#eventos",   hint: "Próximas sesiones" },
  { label: "Proyectos", href: "#proyectos", hint: "Lo que ya se está enviando" },
  { label: "Únete",     href: "#unete",     hint: "Formulario de registro" },
];

const ACTION_ITEMS = [
  { label: "Ir al inicio", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  { label: "Copiar enlace", action: () => navigator.clipboard.writeText(window.location.href) },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Keyboard hint visible in navbar (rendered by Navbar via this export) */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Buscar sección, acción…" />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>

            <CommandGroup heading="Navegación">
              {NAV_ITEMS.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => scrollTo(item.href)}
                  className="flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Acciones">
              {ACTION_ITEMS.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => { item.action(); setOpen(false); }}
                >
                  {item.label}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setOpen(false);
                }}
              >
                {theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
