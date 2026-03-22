import type { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    mechanism: 'Ciclos de decisión',
    text: 'Pensá en una decisión que se toma todos los días en tu empresa. ¿Quién la toma de principio a fin?',
    options: [
      'Depende del día y de quién esté. No hay una forma definida',
      'Una persona arranca, otra revisa, otra aprueba, otra ejecuta',
      'Hay alguien asignado, pero necesita aprobación para actuar',
      'Una persona ve la información, decide y actúa. El resultado vuelve a ella',
    ],
    revelation:
      'Cada handoff en una decisión agrega latencia, variabilidad y coordinación. La prosperidad se construye cuando una persona completa el ciclo entero.',
  },
  {
    id: 2,
    mechanism: 'Señal que guía',
    text: 'Cuando alguien en tu empresa toma una decisión operativa, ¿la información que necesita ya está ahí?',
    options: [
      'Generalmente decide con lo que tiene en la cabeza',
      'La información existe, pero hay que pedirla, buscarla o esperar un reporte',
      'Tiene dashboards o reportes, pero los mira después de decidir',
      'La información le llega en el momento de decidir, antes de actuar',
    ],
    revelation:
      'Si la información llega después de que decidiste, no te guió — solo documentó lo que ya pasó.',
  },
  {
    id: 3,
    mechanism: 'Fricción',
    text: '¿Cuánta energía de tu empresa se gasta en coordinar, corregir o reaccionar vs en producir y decidir?',
    options: [
      'La mayoría. Reuniones, seguimientos, aprobaciones, retrabajo',
      'Bastante. Hay procesos pero requieren mucha supervisión',
      'Algo. Los procesos críticos corren, pero hay áreas con mucha coordinación manual',
      'Poca. La operación corre con mínima coordinación. La energía va a decidir y mejorar',
    ],
    revelation:
      'La fricción no se resuelve con más gente ni más horas. Se resuelve eliminando la necesidad de coordinar.',
  },
  {
    id: 4,
    mechanism: 'Miedo estructural',
    text: 'La última vez que alguien cometió un error importante en tu empresa, ¿qué pasó después?',
    options: [
      'Se buscó al responsable y hubo consecuencias',
      'Se resolvió el problema inmediato pero no se habló del tema',
      'Se analizó qué pasó, pero las conclusiones no cambiaron nada',
      'Se analizó qué falló en el sistema, se cambió algo concreto, y quedó documentado',
    ],
    revelation:
      'Cuando equivocarse sale caro, nadie decide. Y no decidir es el error más caro de todos.',
  },
  {
    id: 5,
    mechanism: 'Atractores',
    text: 'Pensá en el último cambio importante que implementaste. ¿Sigue funcionando hoy?',
    options: [
      'No. Volvimos a como estábamos antes',
      'Parcialmente. Algo quedó pero la mayoría se diluyó',
      'El cambio pegó, pero costó mucho más de lo esperado mantenerlo',
      'Sí. Funciona y se mantiene sin que nadie lo empuje',
    ],
    revelation:
      'Los cambios no pegan porque los incentivos reales no cambiaron. Eso se llama atractor — y es lo primero que hay que mover.',
  },
  {
    id: 6,
    mechanism: 'Compensación',
    text: '¿Tu gente sabe cómo lo que hace impacta en el resultado del negocio?',
    options: [
      'No. Hacen su trabajo pero no ven la conexión',
      'Vagamente. Saben que "si nos va bien, les va bien" pero no hay nada concreto',
      'Tienen metas y bonos, pero no pueden trazar la línea entre sus decisiones diarias y esas metas',
      'Cada persona sabe qué decisiones son suyas, puede ver el impacto, y su compensación refleja eso',
    ],
    revelation:
      'Si alguien no puede ver el impacto de lo que hace, no le podés pedir que lo haga mejor. Pagar no es lo mismo que conectar.',
  },
  {
    id: 7,
    mechanism: 'Holgura',
    text: '¿Tu empresa tiene espacio para pensar, o todo es urgente?',
    options: [
      'Todo es urgente. No hay tiempo para pensar — solo para reaccionar',
      'A veces hay espacio, pero se llena rápido con más tarea',
      'Los líderes tienen algo de tiempo para pensar, pero el equipo operativo no',
      'Hay tiempo protegido para observar, analizar y explorar. No todo es ejecución',
    ],
    revelation:
      'Una empresa sin tiempo para pensar solo puede seguir haciendo lo que ya hace. Eso se siente productivo — hasta que el mundo cambia.',
  },
  {
    id: 8,
    mechanism: 'Operación e innovación',
    text: '¿Tu empresa puede probar cosas nuevas sin romper lo que ya funciona?',
    options: [
      'No. Probar algo nuevo desestabiliza la operación',
      'A veces, pero los experimentos compiten con la operación y casi siempre pierden',
      'Podemos probar, pero no hay forma clara de decidir qué sigue y qué se mata',
      'Hay espacio explícito para explorar, con reglas claras, sin afectar la operación diaria',
    ],
    revelation:
      'Si probar algo nuevo desestabiliza todo, la empresa no innova — sobrevive. Y sobrevivir no es prosperar.',
  },
  {
    id: 9,
    mechanism: 'Delegación a IA',
    text: '¿Sabés qué decisiones de tu empresa deberían tomarse con IA, cuáles con IA + humano, y cuáles solo un humano?',
    options: [
      'No me lo he planteado así. Usamos lo que hay',
      'Hemos probado herramientas, pero no cambiaron cómo decidimos',
      'Usamos IA en algunas cosas, pero cada quien por su cuenta sin un criterio común',
      'Tenemos claro qué automatizar, qué aumentar con IA, y qué mantener 100% humano',
    ],
    revelation:
      'La IA amplifica lo que ya tenés. Si lo que tenés es desorden, vas a tener desorden más rápido.',
  },
  {
    id: 10,
    mechanism: 'Aprendizaje del sistema',
    text: 'Cuando algo funciona bien (o mal) en tu empresa, ¿eso cambia cómo se hace la próxima vez?',
    options: [
      'No. Cada vez empezamos de cero, como si fuera la primera',
      'Las personas aprenden, pero si se van, el aprendizaje se va con ellas',
      'Hay procesos documentados, pero no se actualizan con lo que aprendemos',
      'El sistema captura lo que funciona y lo que no, y la próxima decisión incorpora esa información',
    ],
    revelation:
      'Las personas aprenden. Las empresas que prosperan también. Si alguien se va y el aprendizaje se va con esa persona, no era de la empresa — era de ella.',
  },
];

/**
 * Indicator weights matrix.
 * Each indicator maps to an array of { q: questionIndex (0-based), w: weight }.
 * Ported exactly from reference diagnostic.js lines 128-150.
 */
export const INDICATOR_WEIGHTS: Record<string, { q: number; w: number }[]> = {
  'Diferenciación defendible': [
    { q: 1, w: 0.6 },
    { q: 5, w: 0.3 },
    { q: 7, w: 1.0 },
    { q: 8, w: 0.3 },
    { q: 9, w: 0.6 },
  ],
  Margen: [
    { q: 0, w: 1.0 },
    { q: 1, w: 1.0 },
    { q: 2, w: 1.0 },
    { q: 5, w: 0.6 },
    { q: 8, w: 0.6 },
  ],
  'Clientes que vuelven': [{ q: 9, w: 1.0 }],
  'Talento que quiere estar': [
    { q: 3, w: 1.0 },
    { q: 5, w: 1.0 },
    { q: 6, w: 0.3 },
  ],
  'Capacidad de invertir': [
    { q: 2, w: 0.6 },
    { q: 7, w: 0.3 },
    { q: 8, w: 1.0 },
  ],
  Resiliencia: [
    { q: 0, w: 0.6 },
    { q: 3, w: 0.6 },
    { q: 4, w: 1.0 },
    { q: 6, w: 0.6 },
    { q: 9, w: 0.3 },
  ],
  Opcionalidad: [
    { q: 4, w: 0.6 },
    { q: 6, w: 1.0 },
    { q: 7, w: 0.6 },
  ],
};

export const INDICATOR_LABELS: string[] = [
  'Diferenciación defendible',
  'Margen',
  'Clientes que vuelven',
  'Talento que quiere estar',
  'Capacidad de invertir',
  'Resiliencia',
  'Opcionalidad',
];

export const PALANCA_DESCRIPTIONS: Record<number, { name: string; text: string }> = {
  0: {
    name: 'Ciclos de decisión',
    text: 'Las decisiones recorren varias manos antes de ejecutarse. Cada paso agrega tiempo y ruido — y hay formas concretas de acortarlo.',
  },
  1: {
    name: 'Señal que guía',
    text: 'La información para decidir existe, pero no llega en el momento correcto. Eso hace que se decida por experiencia en vez de por datos.',
  },
  2: {
    name: 'Fricción',
    text: 'Una parte importante de la energía se va en coordinar, supervisar y corregir. Esa energía podría ir a producir y mejorar.',
  },
  3: {
    name: 'Miedo estructural',
    text: 'El costo de equivocarse es alto, y eso frena las decisiones. El sistema puede rediseñarse para que decidir no sea arriesgado.',
  },
  4: {
    name: 'Atractores',
    text: 'Los cambios tienden a diluirse porque los incentivos reales del sistema no los acompañan. Eso tiene solución estructural.',
  },
  5: {
    name: 'Compensación',
    text: 'Las personas trabajan sin ver claramente cómo lo que hacen impacta en el resultado. Conectar eso cambia el comportamiento.',
  },
  6: {
    name: 'Holgura',
    text: 'Todo compite por atención y no queda espacio para observar ni pensar. Sin eso, solo se puede reaccionar.',
  },
  7: {
    name: 'Operación e innovación',
    text: 'Probar algo nuevo compite con la operación del día a día — y la operación casi siempre gana. Se puede separar sin riesgo.',
  },
  8: {
    name: 'Delegación a IA',
    text: 'Hay herramientas disponibles que no están cambiando cómo se toman las decisiones. El criterio de qué automatizar aún no está definido.',
  },
  9: {
    name: 'Aprendizaje del sistema',
    text: 'Lo que se aprende queda en las personas, no en el sistema. Si alguien se va, ese conocimiento se va también.',
  },
};

/**
 * Computed mapping: question index -> array of { indicator, weight }.
 * Built from INDICATOR_WEIGHTS at module load time (same logic as reference lines 176-182).
 */
export const Q_TO_INDICATORS: Record<number, { indicator: string; weight: number }[]> = {};

for (const [ind, weights] of Object.entries(INDICATOR_WEIGHTS)) {
  for (const { q, w } of weights) {
    if (!Q_TO_INDICATORS[q]) Q_TO_INDICATORS[q] = [];
    Q_TO_INDICATORS[q].push({ indicator: ind, weight: w });
  }
}
