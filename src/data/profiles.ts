/**
 * Profile descriptions for the badge display.
 * Keyed by profile class.
 */
export const PROFILE_DESCRIPTIONS: Record<string, string> = {
  absent:
    'Tu empresa funciona por esfuerzo. Los mecanismos que producen prosperidad aún no están construidos.',
  partial:
    'Hay bases, pero los mecanismos clave aún no están conectados. El potencial es claro.',
  building:
    'Los cimientos están. La pregunta es dónde está el valor que se queda sobre la mesa.',
  solid:
    'Tu empresa prospera por diseño, no solo por esfuerzo. Los mecanismos principales operan.',
};

/**
 * Weakness-specific sentences per indicator.
 * Diagnostic tone, not accusatory.
 * Ported from reference diagnostic.js lines 283-291.
 */
export const WEAKNESS_PHRASES: Record<string, string> = {
  'Diferenciación defendible':
    'Lo que te diferencia hoy depende más de esfuerzo que de estructura. Eso funciona — hasta que alguien decide jugar el mismo juego con más recursos.',
  Margen:
    'Hay valor que tu empresa crea pero no captura. La estructura para retener más de ese valor existe — pero no está activada.',
  'Clientes que vuelven':
    'Tus clientes eligen quedarse o irse por razones que probablemente no estás midiendo. Hay valor en entender qué los hace volver — y qué los hace dudar.',
  'Talento que quiere estar':
    'Tu gente trabaja. La pregunta es si el sistema les da las condiciones para dar lo mejor: ver el impacto de lo que hacen, tener autonomía para decidir, y enfrentar desafíos reales.',
  'Capacidad de invertir':
    'La energía va a mantener lo que hay. Queda poco margen para mejorar, explorar o invertir en lo que viene.',
  Resiliencia:
    'Un cambio inesperado — un cliente grande que se va, una persona clave que renuncia, un giro del mercado — tendría más impacto del necesario. Eso se puede diseñar diferente.',
  Opcionalidad:
    'El día a día consume todo. Sin espacio para explorar alternativas, las opciones se van cerrando sin que nadie lo decida.',
};

/**
 * Strength acknowledgment phrases per indicator.
 * Validate what works.
 * Ported from reference diagnostic.js lines 294-302.
 */
export const STRENGTH_PHRASES: Record<string, string> = {
  'Diferenciación defendible':
    'tenés algo propio que otros no copian fácil — eso es raro',
  Margen:
    'tu estructura captura valor — eso es la base de todo lo demás',
  'Clientes que vuelven':
    'tus clientes vuelven — la señal más difícil de fabricar',
  'Talento que quiere estar':
    'tu gente quiere estar — y eso se construyó, no pasó solo',
  'Capacidad de invertir':
    'generás capacidad para mejorar — la mayoría no puede decir eso',
  Resiliencia:
    'tu empresa absorbe golpes sin perder el rumbo',
  Opcionalidad:
    'tenés espacio para elegir hacia dónde ir',
};

/**
 * Mechanism-specific observations per question index.
 * Pattern recognition, not blame.
 * Ported from reference diagnostic.js lines 305-316.
 */
export const MECH_PHRASES: Record<number, string> = {
  0: 'Las decisiones recorren varias manos antes de ejecutarse — cada paso agrega tiempo y ruido.',
  1: 'La información para decidir existe, pero no está en el momento ni en el lugar correcto.',
  2: 'Una parte importante de la energía se va en coordinar, supervisar y corregir.',
  3: 'El costo de equivocarse es alto, y eso hace que se decida menos de lo necesario.',
  4: 'Los cambios que se implementan tienden a diluirse — los incentivos reales no los acompañan.',
  5: 'Las personas trabajan sin ver claramente cómo lo que hacen impacta en el resultado.',
  6: 'Todo compite por atención. No queda espacio para observar, pensar ni explorar.',
  7: 'Probar algo nuevo compite con la operación del día a día — y la operación casi siempre gana.',
  8: 'Hay herramientas disponibles que no están cambiando cómo se toman las decisiones.',
  9: 'Lo que se aprende queda en las personas. Si alguien se va, ese conocimiento se va también.',
};
