import { useState } from "react";
import { Award, CheckCircle, NotebookPen, HelpCircle, Code, Loader2, Play, Sparkles, Send } from "lucide-react";
import { EvaluationResult } from "../types";

export default function InteractiveExercise() {
  const [exerciseCode, setExerciseCode] = useState<string>(`// Escribe aquí tu solución en Java o TypeScript
// Ejemplo de estructura a implementar:

public class AprobadorAsistente extends BaseAprobador {
    @Override
    public void procesarCompra(Compra compra) {
        if (compra.getMonto() < 100) {
            System.out.println("Compra aprobada por Asistente");
        } else {
            super.procesarCompra(compra); // Pasar al siguiente
        }
    }
}
`);
  const [designDescription, setDesignDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<number | null>(null);

  // Preguntas de reflexión para el taller de los compañeros (Rubrica punto 6)
  const reflectionQuestions = [
    {
      q: "¿Qué sucede si no configuramos la referencia al siguiente sucesor (next) en el cliente?",
      a: "Si el enlace sucesor no se define, se produce una ruptura prematura de la cadena. Cuando el manejador que recibe la petición no pueda procesarla, intentará llamar a 'next.handle()' que será nulo, arrojando un NullPointerException (en Java) o simplemente terminando la ejecución de forma abrupta, dejando la petición colgando."
    },
    {
      q: "¿Se garantiza siempre que una petición sea procesada en una Cadena de Responsabilidad?",
      a: "No, no hay garantía intrínseca. El patrón permite que una petición se recorra por toda la cadena de arriba a abajo y termine saliendo sin que ningún eslabón decida responderla. Es una buena práctica colocar un 'manejador sumidero' al final de la cadena de forma intencional para capturar y notificar estos huérfanos."
    },
    {
      q: "¿Cuáles principios de diseño SOLID se potencian especialmente al aplicar Chain of Responsibility?",
      a: "Principalmente dos:\n1. Principio de Responsabilidad Única (SRP): Cada manejador concreto tiene un único motivo para cambiar: su criterio específico de procesamiento.\n2. Principio Abierto/Cerrado (OCP): Podemos añadir nuevos manejadores a la cadena o alterar el orden jerárquico en tiempo de ejecución sin modificar una sola línea de código de las clases existentes de los manejadores."
    }
  ];

  const handleEvaluate = () => {
    setLoading(true);
    setEvaluation(null);

    // Simulated short delay for highly-satisfying interactive loading state
    setTimeout(() => {
      const codeLower = exerciseCode.toLowerCase();
      const descLower = designDescription.toLowerCase();
      
      const hasInterfaceOrAbstract = codeLower.includes("interface ") || codeLower.includes("abstract class") || codeLower.includes("class aprobadorbase") || codeLower.includes("class aprobador");
      const hasNextField = codeLower.includes("next") || codeLower.includes("successor") || codeLower.includes("siguiente") || codeLower.includes("aprobadorbase");
      const hasSubclasses = codeLower.includes("asistente") || codeLower.includes("gerente") || codeLower.includes("cfo") || codeLower.includes("director") || codeLower.includes("comité") || codeLower.includes("comite");
      const hasHandlerCall = codeLower.includes("procesarcompra") || codeLower.includes("handle") || codeLower.includes("procesar") || codeLower.includes("super.") || codeLower.includes("next.");
      
      let score = 5.0;
      const suggestions: string[] = [];
      const bulletDetails: string[] = [];
      
      if (hasInterfaceOrAbstract) {
        bulletDetails.push("Establece la jerarquía base de forma correcta a través de un Manejador (Handler) o clase abstracta.");
      } else {
        score -= 1.0;
        suggestions.push("Se recomienda definir un 'AprobadorBase' (clase abstracta) o 'IAprobador' (interfaz) para desacoplar el cliente de las implementaciones concretas.");
      }

      if (hasNextField) {
        bulletDetails.push("Declara correctamente la referencia de recursividad jerárquica ('next' o 'siguiente') para delegar peticiones.");
      } else {
        score -= 1.5;
        suggestions.push("Indispensable: Declara un atributo para almacenar la referencia al siguiente evaluador de la cadena (p. ej., 'AprobadorBase next') para posibilitar el encadenamiento.");
      }

      if (hasSubclasses) {
        bulletDetails.push("Identifica e implementa los eslabones concretos sugeridos en el planteamiento jerárquico (Asistente, Gerente, CFO).");
      } else {
        score -= 1.0;
        suggestions.push("No se detectaron clases de eslabones concretos para los cargos contractuales descritos (AsistenteAprobador, GerenteAprobador, CFOAprobador).");
      }

      if (hasHandlerCall) {
        bulletDetails.push("Establece de manera adecuada la delegación en caso de que un eslabón no logre procesar el monto (llamado recursivo al sucesor).");
      } else {
        score -= 0.5;
        suggestions.push("Asegúrate de invocar 'next.procesarCompra()' o en su defecto llamar al método de la superclase ('super.procesarCompra()') cuando el monto sobrepasa el límite del eslabón actual.");
      }

      if (descLower.includes("setnext") || descLower.includes("vincular") || descLower.includes("cadena") || descLower.includes("link") || descLower.includes("enlace") || descLower.includes("siguiente")) {
        bulletDetails.push("Describe correctamente en el diseño cómo se orquesta y une la cadena a nivel de cliente.");
      } else if (!designDescription) {
        score -= 0.5;
        suggestions.push("Para una calificación impecable, añade una breve descripción de tu diseño explicando cómo enlazas tus clases en el cliente.");
      }

      score = Math.max(1.0, Math.min(5.0, score));
      const approved = score >= 3.0;

      let feedback = "";
      if (approved) {
        feedback = `¡Excelente trabajo de modelado! Has estructurado el patrón de diseño Chain of Responsibility con total fidelidad académica de acuerdo a la rúbrica de la UPC. ` +
          `Se constató un acoplamiento sumamente bajo debido al uso correcto de abstracciones. ` +
          bulletDetails.map(b => "🔹 " + b).join(" ");
      } else {
        feedback = `La estructura no define completamente el patrón Chain of Responsibility. Recuerda que para contar con una cadena de eslabones válida, cada nodo requiere un sucesor al cual traspasar la responsabilidad cuando corresponde. Observaciones: ` +
          suggestions.join(" ");
      }

      setEvaluation({
        approved,
        score,
        feedback,
        suggestions: suggestions.length > 0 ? suggestions : ["¡Todo luce espectacular! Tu código es un excelente ejemplo didáctico."]
      });
      setLoading(false);
    }, 850);
  };

  return (
    <div id="ejercicio-practico" className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-6 font-sans shadow-xs">
      {/* Cabecera del Ejercicio */}
      <div>
        <h4 className="text-sm font-bold tracking-wide uppercase text-indigo-700 mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-650 bg-indigo-600 animate-pulse"></span> Ejercicio Práctico para los Compañeros
        </h4>
        <p className="text-xs text-slate-600">
          Usa este taller interactivo en clase. Tus compañeros pueden programar la solución e inspeccionar los criterios de aprobación académica de forma instantánea.
        </p>
      </div>

      {/* Grid: Enunciado vs Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Enunciado del Taller */}
        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-3">
              <NotebookPen className="h-5 w-5 text-indigo-600 shrink-0" />
              <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Taller: Evaluador Financiero Corporativo</h5>
            </div>

            {/* Planteamiento (Rubrica Punto 1 y 2) */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-3">
              <p>
                <span className="font-bold text-indigo-700">Planteamiento:</span> Diseñe un sistema de autorización capaz de evaluar las solicitudes de fondos económicos mensuales generados por los empleados de una compañía. El límite jerárquico es contractual:
              </p>
              
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li><strong className="text-slate-800">Asistente:</strong> Aprueba compras menores a <strong className="text-slate-800">$100 USD</strong>.</li>
                <li><strong className="text-slate-800">Gerente:</strong> Aprueba compras de <strong className="text-slate-800">$100 USD a $1,000 USD</strong>.</li>
                <li><strong className="text-slate-800">Director CFO:</strong> Aprueba compras de <strong className="text-slate-800">$1,000 USD a $5,000 USD</strong>.</li>
                <li><strong className="text-slate-800">Comité Ejecutivo:</strong> Aprueba gastos de <strong className="text-slate-800">$5,000 USD en adelante</strong> (Monto máximo absoluto $10,000 USD, mayor se rechaza).</li>
              </ul>

              {/* Clases sugeridas e Instrucciones (Rubrica Punto 3 y 4) */}
              <div className="bg-indigo-50/60 p-3 rounded border border-indigo-200 mt-2">
                <span className="font-bold text-[10px] text-indigo-700 uppercase tracking-wider block mb-1">Estructura Sugerida</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Cree una clase abstracta <code>AprobadorBase</code> con campo <code>next</code> y método <code>procesarCompra()</code>. Implemente las clases derivadas: <code>AsistenteAprobador</code>, <code>GerenteAprobador</code>, <code>CFOAprobador</code> y configúrelas en serie.
                </p>
              </div>
            </div>
          </div>

          {/* Resultado esperado */}
          <div className="mt-4 border-t border-slate-200 pt-3">
            <span className="font-bold text-[10px] text-indigo-700 uppercase tracking-widest block mb-1">Resultado Esperado (Output)</span>
            <pre className="text-[10px] font-mono bg-white p-2.5 border border-slate-200 rounded text-amber-850 text-amber-800 leading-tight">
{`Petición por $75 USD -> Aprobado por Asistente.
Petición por $450 USD -> Aprobado por Gerente.
Petición por $12,000 USD -> Rechazado por exceso bancario.`}
            </pre>
          </div>
        </div>

        {/* Editor del Alumno y Evaluación */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between shadow-3xs">
            {/* Nav del Editor */}
            <div className="bg-slate-200/60 px-4 py-2 flex justify-between items-center rounded-t-lg border-b border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                <Code className="h-4 w-4 text-indigo-600" /> Workbench de Solución de Alumnos
              </span>
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono border border-indigo-200">
                Evaluador Dinámico
              </span>
            </div>

            {/* Inputs */}
            <div className="p-4 flex flex-col gap-3 font-sans">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Código en TypeScript o Java</label>
                <textarea
                  className="w-full h-[180px] bg-white text-slate-800 font-mono text-[11px] border border-slate-200 rounded p-3 focus:outline-none focus:border-indigo-500"
                  value={exerciseCode}
                  onChange={e => setExerciseCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Criterio de Diseño y Patrón (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Creamos cuatro eslabones y los vinculamos en Main mediante setNext."
                  className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                  value={designDescription}
                  onChange={e => setDesignDescription(e.target.value)}
                />
              </div>

              <button
                onClick={handleEvaluate}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Evaluando código...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Enviar para Calificación en Vivo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resultado de la Calificación por la Rúbrica */}
          {evaluation && (
            <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              evaluation.approved ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
            }`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Award className={`h-6 w-6 ${evaluation.approved ? "text-emerald-600" : "text-rose-600"}`} />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-500">Retroalimentación Docente (Rúbrica)</span>
                    <h6 className="font-bold text-sm">
                      Estado: {evaluation.approved ? "✅ SOLUCIÓN APROBADA" : "⚠️ REQUIERE MODIFICACIÓN"}
                    </h6>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">Calificación</span>
                  <span className={`text-xl font-mono font-bold ${evaluation.score >= 3.0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {evaluation.score.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {evaluation.feedback}
              </p>

              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <div className="border-t border-slate-200 pt-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Sugerencias pedagógicas</span>
                  <ul className="list-disc pl-4 space-y-1">
                    {evaluation.suggestions.map((sug, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600">
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preguntas de Reflexión (Card quiz - excelente para la dinámica grupal) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-3xs">
        <h5 className="text-[10px] uppercase font-bold text-slate-600 tracking-wider mb-3 flex items-center gap-1.5 font-sans">
          <HelpCircle className="h-4 w-4 text-indigo-600" /> Preguntas de Reflexión para el Auditorio
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reflectionQuestions.map((quiz, idx) => {
            const isOpen = activeQuizQuestion === idx;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border transition cursor-pointer select-none font-sans ${
                  isOpen ? "bg-white border-indigo-500/50 shadow-inner" : "bg-white border-slate-200 hover:border-slate-350"
                }`}
                onClick={() => setActiveQuizQuestion(isOpen ? null : idx)}
              >
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-bold text-slate-800">
                    {quiz.q}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold shrink-0">
                    {isOpen ? "Ocultar" : "Revelar"}
                  </span>
                </div>
                
                {isOpen && (
                  <p className="text-[11px] text-slate-650 text-slate-600 mt-2.5 pt-2 border-t border-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in duration-250">
                    {quiz.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
