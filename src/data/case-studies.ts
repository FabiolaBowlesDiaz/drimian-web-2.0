export interface CaseMetric {
  number: string;
  label: string;
}

export interface CaseStudy {
  id: number;
  industry: string;
  metrics: CaseMetric[];
  context: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    industry: "Clínica privada",
    metrics: [
      { number: "141", label: "hallazgos en 14 áreas" },
      { number: "+$2M", label: "en valor escondido por año" },
      { number: "10", label: "patrones sistémicos cruzados" },
    ],
    context:
      "El margen había caído 15 puntos en 3 años. El diagnóstico reveló que el problema no estaba donde creían. 8 intervenciones diseñadas sin contratar gente nueva ni comprar tecnología.",
  },
  {
    id: 2,
    industry: "Seguro de salud",
    metrics: [
      { number: "23,580", label: "precios calculados" },
      { number: "46%", label: "del portafolio subvalorado" },
      { number: "37", label: "decisiones cerradas" },
    ],
    context:
      "250+ combinaciones de productos legacy reemplazadas por 4 productos claros. $404K/año en subvaluación identificada con un plan de recuperación que no genera fuga de clientes.",
  },
  {
    id: 3,
    industry: "Constructora",
    metrics: [
      { number: "$7.5M", label: "proyecto analizado y marginalizado" },
      { number: "56%", label: "inflación en coeficientes corregida" },
      { number: "26", label: "personas evaluadas en 4 áreas" },
    ],
    context:
      "Las proyecciones de costo estaban infladas más de 50%. Con datos reales del proyecto terminado, se corrigió la base para todos los proyectos futuros. 11 terrenos en evaluación con un sistema que antes no existía.",
  },
  {
    id: 4,
    industry: "Hotel",
    metrics: [
      { number: "24,648", label: "room-nights analizadas" },
      { number: "+$80K", label: "en revenue identificado por año" },
      { number: "$10-15", label: "gap vs competencia por noche" },
    ],
    context:
      "El hotel cobraba $10-15 menos por noche que el competidor más cercano sin razón visible. Pricing dinámico en diseño con reglas explícitas que antes vivían en la cabeza de una persona.",
  },
];
