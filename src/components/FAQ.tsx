"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "¿Hay que saber programar para unirse?",
    a: "No. Tenemos diseñadores, analistas, estudiantes de derecho y hasta de filosofía. Si quieres construir algo — código, diseño, estrategia — hay lugar para vos.",
  },
  {
    q: "¿Es gratis?",
    a: "Sí, la membresía es completamente gratis para estudiantes de la UPB. Los eventos, workshops y recursos de AWS también. Lo único que te pedimos es que te aparezcas y hagas cosas.",
  },
  {
    q: "¿Pueden unirse estudiantes de primer año?",
    a: "Especialmente de primer año. No hay requisito de semestre. Cuanto antes entres, más proyectos vas a poder construir antes de graduarte.",
  },
  {
    q: "¿Qué stack usan en los proyectos?",
    a: "Depende del proyecto. La mayoría usa Next.js, React Native, Python o Node en el backend, y servicios AWS (Lambda, S3, DynamoDB, Amplify) para infra. Pero nadie te obliga a usar AWS — shipea con lo que sepas.",
  },
  {
    q: "¿Qué pasa en un Demo Night?",
    a: "Cada dos semanas, equipos que estuvieron construyendo algo lo muestran en 5 minutos. No tiene que ser perfecto — tiene que funcionar. Después hay tiempo para hablar, dar feedback y conectar.",
  },
  {
    q: "¿Puedo unirme si ya tengo un proyecto en curso?",
    a: "Perfecto. Trae el proyecto, únete a un equipo o busca colaboradores acá. Muchos de los proyectos en la sección de proyectos empezaron así.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        }
      );
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> 05 / FAQ
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Preguntas frecuentes.
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              Si algo no está acá, escríbenos en Instagram o aparécete a un
              Demo Night y pregunta en persona.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
          <div />
          <div ref={listRef}>
            <Accordion multiple={false} className="space-y-1">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={i}
                  className="border border-ink-100 dark:border-ink-800/50 rounded-xl px-5 bg-white dark:bg-ink-900/40"
                >
                  <AccordionTrigger className="text-[15px] font-medium text-ink-900 dark:text-ink-050 text-left py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-ink-600 dark:text-ink-400 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
