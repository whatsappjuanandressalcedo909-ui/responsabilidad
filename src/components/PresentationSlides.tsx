import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, AlertTriangle, CheckCircle, Award, Compass, Sparkles, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PresentationSlidesProps {
  onGoToSection: (sectionId: string) => void;
}

export default function PresentationSlides({ onGoToSection }: PresentationSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Cadena de Responsabilidad",
      subtitle: "Chain of Responsibility Pattern",
      category: "Portada",
      content: (
        <div className="flex flex-col items-center text-center justify-center h-full py-8">
          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/15 mb-4">
            Especialización en Ingeniería de Software
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-sans md:text-4xl">
            Chain of Responsibility
          </h2>
          <p className="text-sm font-mono text-slate-400 mb-8 font-medium">
            Patrones de Diseño de Comportamiento ─ Unidad 3
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg bg-slate-950 p-5 rounded-xl border border-slate-800 text-left mb-6">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Institución</span>
              <span className="text-xs font-bold text-slate-200">Universidad Popular del Cesar</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Asignatura</span>
              <span className="text-xs font-bold text-slate-200">Patrones de Diseño de Software</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Actividad</span>
              <span className="text-xs font-bold text-slate-201 text-slate-300">Análisis e Implementación Práctica</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Elaborado por</span>
              <span className="text-xs font-bold text-indigo-300 font-serif">Grupo de Especialidad</span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setCurrentSlide(1)}
              className="py-2 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              Comenzar Exposición
            </button>
            <button
              onClick={() => onGoToSection("simulador")}
              className="py-2 px-5 bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-750 font-bold text-xs rounded-lg uppercase tracking-wider transition"
            >
              Ver Demo Interactivo
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Intención y Definición",
      subtitle: "La esencia del patrón",
      category: "Concepto",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-left">
          {/* Intencion del patron (Rubrica punto 3 - Frase clara) */}
          <div className="bg-indigo-500/5 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-6 leading-relaxed">
            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider block mb-1.5">Intención de Diseño (Rubrica)</span>
            <blockquote className="text-sm font-medium text-slate-100 font-sans italic">
              &ldquo;Evita acoplar el emisor de una petición a su receptor, al dar a más de un objeto la oportunidad de responder a la solicitud. Encadena los objetos receptores y pasa la petición a lo largo de la cadena hasta que un objeto la procese.&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
            <div>
              <h5 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-indigo-400" /> Filosofía del Patrón
              </h5>
              <p className="text-xs text-slate-400">
                Imagina un sistema de aprovisionamiento donde una solicitud pasa de mano en mano. El emisor no necesita conocer el organigrama interno de la compañía, solo pone la hoja en la primera oficina y el flujo orgánico se encarga del resto.
              </p>
              <p className="text-xs text-slate-400 mt-2.5">
                Al desvincular al solicitante del procesador, se promueve un diseño flexible acorde al principio SOLID de Responsabilidad Única.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h5 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> Metáfora Práctica
              </h5>
              <ul className="space-y-1 text-xs text-slate-400">
                <li><strong className="text-slate-300">Emisor:</strong> El cliente que arroja una moneda en un expendedor automático.</li>
                <li><strong className="text-slate-300">Receptores (Cadena):</strong> Sensores de pesos y diámetros. Si el primer sensor (50c) no coincide, deriva al siguiente (1 USD).</li>
                <li><strong className="text-slate-300">Resultado:</strong> La moneda es validada por el eslabón idóneo de forma transparente.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "El Problema que Resuelve",
      subtitle: "¿Por qué surge la necesidad de este patrón?",
      category: "Problema",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-left leading-relaxed">
          <p className="text-xs text-slate-300 mb-4 font-sans">
            Para la evaluación de la rúbrica, es crucial explicar las dificultades de diseño y malas prácticas que emergen si <strong className="text-indigo-400">no</strong> aplicamos Chain of Responsibility:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-rose-450 uppercase tracking-widest block mb-1">Dificultad de Diseño</span>
                <h5 className="font-bold text-xs text-slate-200 mb-1.55">Acoplamiento Severo</h5>
                <p className="text-[11px] text-slate-400">
                  El componente emisor de eventos debe conocer la identidad exacta de todos los manejadores del sistema, sus clases concretas y cómo llamarlos.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-rose-450 uppercase tracking-widest block mb-1">Malas Prácticas</span>
                <h5 className="font-bold text-xs text-slate-200 mb-1.55">Condicionales Monolíticos</h5>
                <p className="text-[11px] text-slate-400">
                  Uso masivo de estructuras anidadas <code>if-else</code> o <code>switch</code> para filtrar y derivar solicitudes, resultando en clases de mil líneas difíciles de auditar.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-rose-455 uppercase tracking-widest block mb-1">Limites en Extensión</span>
                <h5 className="font-bold text-xs text-slate-200 mb-1.55">Violación del OCP</h5>
                <p className="text-[11px] text-slate-400">
                  Cualquier requerimiento para agregar un eslabón obliga a modificar la clase del cliente, rompiendo el principio SOLID Abierto/Cerrado.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <span>
              Si no aplicamos el patrón, el código evoluciona a un <strong>monolito de despacho rígido</strong>, propenso a bugs de regresión cada vez que cambien las reglas del negocio o la jerarquía.
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Contexto de Uso",
      subtitle: "¿Cuándo y dónde conviene aplicarlo?",
      category: "Aplicabilidad",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-left leading-relaxed">
          <p className="text-xs text-slate-350 mb-4">
            El grupo debe describir en situaciones reales cuándo es altamente recomendable la aplicación del patrón. Presta atención a estas señales e indicadores técnicos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h5 className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-2">Escenarios Recomendados</h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Múltiples objetos pueden procesar una petición, pero el procesador idóneo se calcula de forma dinámica en ejecución.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Deseas autorizar, validar o filtrar una operación mediante varias capas ordenadas (p. ej., filtros HTTP, validaciones de seguridad).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>El conjunto de candidatos y su orden de ruteo debe configurarse de forma dinámica (pueden cambiar en tiempo de ejecución).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h5 className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-2">Señales en el Código Solucionado</h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Aparecen filtros encadenados o middlewares en frameworks de backend (como Express en NodeJS, o filtros de Security en Spring).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Tratamiento de eventos gráficos de interfaz (GUI Events), donde un clic se pasa de un botón, a su panel contenedor, a la ventana global.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => onGoToSection("simulador")}
              className="py-1.5 px-3 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/25 rounded font-bold text-xs transition cursor-pointer"
            >
              🔍 Ver simulación del sistema de soporte multinivel
            </button>
            <button
              onClick={() => onGoToSection("diagrama-uml")}
              className="py-1.5 px-3 bg-slate-800 text-slate-330 border border-slate-750 font-bold text-xs rounded transition cursor-pointer"
            >
              📐 Ver relaciones de clases en el UML
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Ventajas e Inconvenientes",
      subtitle: "Argumentación técnica para la defensa",
      category: "Análisis",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-left leading-relaxed">
          <p className="text-xs text-slate-300 mb-4">
            El jurado de la Universidad Popular del Cesar evaluará la capacidad de argumentar ventajas y desventajas. Aquí tienes los pilares clave:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ventajas */}
            <div className="bg-emerald-950/10 p-4 rounded-lg border border-emerald-900/20">
              <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Ventajas / Fortalezas
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <strong className="text-slate-300 block">Acoplamiento minimalista:</strong> El emisor y el receptor no tienen conocimiento mutuo detallado directo.
                </li>
                <li>
                  <strong className="text-slate-300 block">Principio Abierto / Cerrado:</strong> Puedes introducir nuevos manejadores concretos sin fracturar el código base.
                </li>
                <li>
                  <strong className="text-slate-300 block">Flexibilidad jerárquica:</strong> Se puede reordenar, remover o añadir pasos a la cadena en caliente modificando punteros.
                </li>
              </ul>
            </div>

            {/* Desventajas */}
            <div className="bg-rose-950/10 p-4 rounded-lg border border-rose-900/20">
              <h5 className="font-bold text-xs text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Desventajas / Limitaciones
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <strong className="text-slate-300 block">Sin garantía de recepción:</strong> Al no haber un receptor explícito, la petición puede salir de la cadena sin ser atendida.
                </li>
                <li>
                  <strong className="text-slate-300 block">Complejidad de Debugging:</strong> Seguir la traza paso a paso cruzando múltiples clases abstractas y dinámicas puede ser tortuoso.
                </li>
                <li>
                  <strong className="text-slate-300 block">Ciclos o bucles infinitos:</strong> Si el desarrollador encadena por descuido el final de la cadena de vuelta al inicio, se produce un bucle sin fin.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Conclusiones del Estudio",
      subtitle: "Para el entregable de la rúbrica",
      category: "Cierre",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-left leading-relaxed">
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-4 mb-4">
            <h5 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" /> Criterios Clave de Conclusión (UPC)
            </h5>
            
            <div className="space-y-3 text-xs text-slate-400">
              <p>
                <strong className="text-slate-300">1. Desacoplamiento como meta:</strong> El patrón resuelve de forma elegante el problema de ruteo de información, moviendo la lógica de despacho compleja fuera del cliente y diluyéndola en pequeñas clases cohesivas de manejadores con responsabilidad única.
              </p>
              <p>
                <strong className="text-slate-300">2. Esencial para Frameworks:</strong> Es la arquitectura subyacente de la gran mayoría de frameworks web modernos de procesamiento HTTP. Toda la tubería de filtros (Logging, Autenticación, CORS, Compresión) es un ejemplo estricto de Chain of Responsibility.
              </p>
              <p>
                <strong className="text-slate-300">3. El enlace dinámico vence a la rigidez:</strong> Frente a soluciones estáticas basadas en herencia masiva, la composición dinámica por puntero <code>next</code> brinda adaptabilidad extrema frente a flujos de negocio cambiantes.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => onGoToSection("ejercicios")}
              className="py-2 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider transition flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Ir a poner a prueba a los compañeros
            </button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div id="slides-modulo" className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
      {/* Selector de diapositiva superior */}
      <div className="flex justify-between items-center border-b border-slate-805/80 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          <div>
            <h4 className="font-sans font-bold text-xs text-slate-200 uppercase tracking-widest leading-none">
              Presentación Interactiva
            </h4>
            <span className="text-[10px] text-slate-500 block">
              Diapositiva {currentSlide + 1} de {slides.length} ─ Categoría: <strong className="text-indigo-400">{slide.category}</strong>
            </span>
          </div>
        </div>

        {/* Círculos de navegación rápida */}
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-6 bg-indigo-500" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido Diapositiva Animada */}
      <div className="bg-slate-950 p-6 rounded-lg border border-slate-800/80 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* Títulos de la Diapositiva */}
            <div className="mb-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                {slide.subtitle}
              </span>
              <h3 className="text-xl font-bold text-slate-100 font-sans tracking-tight">
                {slide.title}
              </h3>
            </div>

            {/* Contenido específico de cada diapo */}
            <div className="flex-1">
              {slide.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación inferiores */}
        <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentSlide === 0}
            className="py-1.5 px-3 bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded hover:bg-slate-850 text-slate-300 flex items-center gap-1 transition"
          >
            <ChevronLeft className="h-4 w-4" /> Diapositiva Anterior
          </button>

          <span className="text-[10px] font-semibold text-slate-500 font-mono">
            Especialización UPC ─ Patrón CoR
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="py-1.5 px-3 bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded hover:bg-slate-850 text-slate-300 flex items-center gap-1 transition"
          >
            Siguiente Diapositiva <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
