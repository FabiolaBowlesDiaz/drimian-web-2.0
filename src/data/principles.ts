export interface Principle {
  id: number;
  title: string;
  body: string;
  month: number; // 1-12
}

export const principles: Principle[] = [
  {
    id: 1,
    month: 1,
    title: "El sistema produce resultados, no las personas.",
    body: "La misma persona produce 92 en un sistema y 45 en otro. Antes de cambiar a la gente, mirá el sistema en el que operan. Si un problema se repite con personas diferentes, el problema no son las personas.",
  },
  {
    id: 2,
    month: 2,
    title: "Empujar más fuerte no funciona.",
    body: "Después de cualquier cambio, el sistema tiende a volver a donde estaba — a menos que cambies lo que lo mantiene ahí. Se llama atractor. Si los incentivos reales no cambiaron, el cambio no va a pegar.",
  },
  {
    id: 3,
    month: 3,
    title: "La IA amplifica lo que ya tenés.",
    body: "Si lo que tenés es un buen sistema de decisiones, la IA lo hace más rápido y más preciso. Si lo que tenés es desorden, la IA te da desorden a escala. Antes de implementar IA, asegurate de que hay algo bueno que amplificar.",
  },
  {
    id: 4,
    month: 4,
    title: "Primero efectividad, después eficiencia.",
    body: "Antes de preguntarte cómo hacerlo mejor, preguntate si debería hacerse. Las empresas que prosperan eliminan lo innecesario antes de optimizar lo que queda. Eficiencia sin efectividad es hacer muy bien lo que no importa.",
  },
  {
    id: 5,
    month: 5,
    title: "La fricción es el enemigo que podés medir.",
    body: "Cada hora de coordinación manual, cada reporte que nadie lee, cada aprobación que no agrega valor es fricción. No se resuelve con más gente ni más horas — se resuelve eliminando la necesidad de coordinar.",
  },
  {
    id: 6,
    month: 6,
    title: "No todo lo que se dice importa igual.",
    body: "Los datos del sistema pesan más que el comportamiento observable, y el comportamiento pesa más que lo que la gente dice en encuestas. Si tu única fuente de información es lo que la gente declara, estás viendo la película con los ojos cerrados.",
  },
  {
    id: 7,
    month: 7,
    title: "Prosperar no es maximizar.",
    body: "Una empresa prospera cuando es suficiente en 7 dimensiones, no cuando maximiza una sola. Maximizar margen destruye talento. Maximizar crecimiento destruye resiliencia. La prosperidad es equilibrio sostenible.",
  },
  {
    id: 8,
    month: 8,
    title: "Adaptar, no copiar.",
    body: "Los principios son universales pero las implementaciones son contextuales. Lo que funciona en una multinacional puede destruir a una empresa familiar. Antes de importar una 'best practice', preguntate por qué funciona allá y qué es diferente acá.",
  },
  {
    id: 9,
    month: 9,
    title: "Medir para entender, no para castigar.",
    body: "Si la gente tiene miedo de que sus números se vean, las métricas están contaminadas. Los mejores sistemas de medición generan curiosidad, no ansiedad. Cuando medir se siente como vigilancia, lo que medís deja de ser verdad.",
  },
  {
    id: 10,
    month: 10,
    title: "Diagnosticar ya es intervenir.",
    body: "El acto de observar cambia el sistema. Cuando le preguntás a un dueño cómo se toman las decisiones en su empresa, ya empezó a ver lo que antes no veía. El diagnóstico no es previo al cambio — es el primer cambio.",
  },
];

/**
 * Returns the principle for the current month.
 * Since Astro builds at deploy time, this selects at build time.
 * Rotation happens on redeploy.
 * Months 11 and 12 wrap: month 11 = principle 1, month 12 = principle 2.
 */
export function getCurrentPrinciple(): Principle {
  const month = new Date().getMonth(); // 0-11
  return principles[month % principles.length];
}
