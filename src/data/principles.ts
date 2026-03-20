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
    body: "La misma persona produce 92 en un sistema y 45 en otro. Antes de cambiar a la gente, mira el sistema en el que operan. Si un problema se repite con personas diferentes, el problema no son las personas.",
  },
  {
    id: 2,
    month: 2,
    title: "Empujar mas fuerte no funciona.",
    body: "Despues de cualquier cambio, el sistema tiende a volver a donde estaba -- a menos que cambies lo que lo mantiene ahi. Se llama atractor. Si los incentivos reales no cambiaron, el cambio no va a pegar.",
  },
  {
    id: 3,
    month: 3,
    title: "La IA amplifica lo que ya tenes.",
    body: "Si lo que tenes es un buen sistema de decisiones, la IA lo hace mas rapido y mas preciso. Si lo que tenes es desorden, la IA te da desorden a escala. Antes de implementar IA, asegurate de que hay algo bueno que amplificar.",
  },
  {
    id: 4,
    month: 4,
    title: "Primero efectividad, despues eficiencia.",
    body: "Antes de preguntarte como hacerlo mejor, preguntate si deberia hacerse. Las empresas que prosperan eliminan lo innecesario antes de optimizar lo que queda. Eficiencia sin efectividad es hacer muy bien lo que no importa.",
  },
  {
    id: 5,
    month: 5,
    title: "La friccion es el enemigo que podes medir.",
    body: "Cada hora de coordinacion manual, cada reporte que nadie lee, cada aprobacion que no agrega valor es friccion. No se resuelve con mas gente ni mas horas -- se resuelve eliminando la necesidad de coordinar.",
  },
  {
    id: 6,
    month: 6,
    title: "No todo lo que se dice importa igual.",
    body: "Los datos del sistema pesan mas que el comportamiento observable, y el comportamiento pesa mas que lo que la gente dice en encuestas. Si tu unica fuente de informacion es lo que la gente declara, estas viendo la pelicula con los ojos cerrados.",
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
    body: "Los principios son universales pero las implementaciones son contextuales. Lo que funciona en una multinacional puede destruir a una empresa familiar. Antes de importar una 'best practice', preguntate por que funciona alla y que es diferente aca.",
  },
  {
    id: 9,
    month: 9,
    title: "Medir para entender, no para castigar.",
    body: "Si la gente tiene miedo de que sus numeros se vean, las metricas estan contaminadas. Los mejores sistemas de medicion generan curiosidad, no ansiedad. Cuando medir se siente como vigilancia, lo que medis deja de ser verdad.",
  },
  {
    id: 10,
    month: 10,
    title: "Diagnosticar ya es intervenir.",
    body: "El acto de observar cambia el sistema. Cuando le preguntas a un dueño como se toman las decisiones en su empresa, ya empezo a ver lo que antes no veia. El diagnostico no es previo al cambio -- es el primer cambio.",
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
