import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Settings, 
  Trash2, 
  EyeOff, 
  ShieldAlert, 
  FileCode, 
  AlertTriangle, 
  CornerDownRight, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Lock, 
  Flame, 
  Layers
} from "lucide-react";

import { 
  MessageRequest, 
  SizeValidationHandler, 
  SecuritySanitizationHandler, 
  PIIMaskHandler, 
  ProfanityFilterHandler, 
  PriorityDetectorHandler 
} from "./ChainOfResponsibility";

// Mensajes de plantilla académicos para testing rápido
const TEMPLATES = [
  {
    title: "Ataque SQL & Datos de Pago",
    text: "Hola auxilio, mi correo es juan_perez@upc.edu.co y mi tarjeta de crédito es 4111 2222 3333 4444. Intenté buscar mis transacciones pero un usuario ingresó: UNION SELECT * FROM clientes. Necesito su ayuda.",
    desc: "Contiene datos personales expuestos y un intento de inyección de comando SQL malicioso."
  },
  {
    title: "Insultos & Mensaje Negativo",
    text: "¡El servicio de soporte es una BASURA total! Todo falla y este sistema es estúpido e inútil. ¿Por qué está todo roto? Solo quiero saber la hora de atención ordinaria.",
    desc: "Contiene exabruptos y palabras que no cumplen los estándares de etiqueta académica del aula."
  },
  {
    title: "Alerta Crítica & Urgente",
    text: "¡ATENCIÓN! El sistema de pagos está caído y ha provocado un colapso en la pasarela. Los saldos salen en cero y la base de datos de sesión está bloqueada.",
    desc: "Un reporte técnico legítimo que requiere asignación inmediata de prioridad Crítica."
  },
  {
    title: "Mensaje Conforme & Seguro",
    text: "Estimados profesores, adjunto la entrega final del grupo 4 de Patrones de Diseño. Hemos implementado todos los diagramas y el código funciona en el servidor remoto.",
    desc: "Un correo ejemplar que debería pasar a través de todos los filtros sin alterar el texto ni lanzar alarmas."
  }
];

export default function DemoPatron() {
  const [inputText, setInputText] = useState(TEMPLATES[0].text);
  
  // Lista de eslabones disponibles con su estado activo/inactivo regulable por el usuario
  const [handlersSetup, setHandlersSetup] = useState([
    { id: "size", name: "Validador de Tamaño", icon: FileText, active: true, desc: "Rechaza si está vacío, advierte si pasa 300 letras." },
    { id: "security", name: "Filtro de Seguridad", icon: ShieldAlert, active: true, desc: "Remueve inyecciones SQL sospechosas e inyecciones HTML." },
    { id: "pii", name: "Protector de Privacidad (PII)", icon: Lock, active: true, desc: "Enmascara correos y números de tarjetas de crédito." },
    { id: "profanity", name: "Filtro de Respeto / Cortesía", icon: EyeOff, active: true, desc: "Sustituye expresiones vulgares o negativas extremas." },
    { id: "priority", name: "Clasificador de Prioridades", icon: Flame, active: true, desc: "Detecta palabras críticas para priorización de atención." }
  ]);

  const [activeTab, setActiveTab] = useState<"sandbox" | "explicacion">("sandbox");
  const [result, setResult] = useState<MessageRequest | null>(null);
  const [executedSteps, setExecutedSteps] = useState<Array<{ name: string; output: string; desc: string; icon: any; status: string }>>([]);

  // Ejecuta la Cadena de Responsabilidad de forma real
  const handleExecuteChain = () => {
    // 1. Crear el objeto de la petición (MessageRequest)
    const request: MessageRequest = {
      text: inputText,
      originalText: inputText,
      status: "success",
      priority: "Media",
      logs: [],
      metadata: {
        scriptsDetected: false,
        piiMasked: false,
        hasProfanity: false,
        charCount: 0,
        wordCount: 0
      }
    };

    // 2. Instanciar los manejadores reales configurados
    const sizeHandler = new SizeValidationHandler();
    const securityHandler = new SecuritySanitizationHandler();
    const piiHandler = new PIIMaskHandler();
    const profanityHandler = new ProfanityFilterHandler();
    const priorityHandler = new PriorityDetectorHandler();

    // Guardar referencia en un mapa para facilitar el encadenamiento dinámico
    const handlersMap: { [key: string]: any } = {
      size: sizeHandler,
      security: securityHandler,
      pii: piiHandler,
      profanity: profanityHandler,
      priority: priorityHandler
    };

    // 3. Crear el encadenamiento dinámico de acuerdo a los eslabones elegidos/activos por el usuario
    const activeHandlers = handlersSetup.filter(h => h.active);
    
    request.logs.push(`🔌 [Inicio CoR] Inicializando pipeline dinámico con ${activeHandlers.length} / ${handlersSetup.length} eslabones.`);

    if (activeHandlers.length === 0) {
      request.logs.push("⚠️ [Pipeline Vacío] Ningún eslabón se encuentra activo. El contenido se entrega sin ningún filtro.");
      setResult(request);
      setExecutedSteps([]);
      return;
    }

    // Encadenar los que están activos en orden secuencial
    for (let i = 0; i < activeHandlers.length - 1; i++) {
      const current = handlersMap[activeHandlers[i].id];
      const next = handlersMap[activeHandlers[i + 1].id];
      current.setNext(next);
    }

    // Lanzar el proceso en el primer eslabón activo
    const firstHandlerId = activeHandlers[0].id;
    const firstHandler = handlersMap[firstHandlerId];
    
    // Llamar recursivamente al handle
    const finalResult = firstHandler.handle(request);
    setResult({ ...finalResult });

    // 4. Calcular el "Tratamiento de paso intermedio" simulando paso a paso para la vista microscópica del alumno
    const stepsTrace: typeof executedSteps = [];
    let currentText = inputText;
    let tempStatus: "success" | "warning" | "rejected" = "success";
    let tempPriority: "Baja" | "Media" | "Alta" | "Crítica" = "Media";

    activeHandlers.forEach(h => {
      // Aplicamos simulación controlada del nodo para mostrar qué hizo ese subproceso exactamente
      let outText = currentText;
      let logMsg = "No modificado";
      let statusResult = "neutral";

      if (h.id === "size") {
        const len = currentText.trim().length;
        if (len === 0) {
          tempStatus = "rejected";
          statusResult = "rejected";
          logMsg = "Rechazado: mensaje vacío";
        } else if (len > 300) {
          tempStatus = "warning";
          statusResult = "warning";
          logMsg = "Excede sugerido (300 letras)";
        } else {
          statusResult = "approved";
          logMsg = "Longitud correcta";
        }
      } 
      else if (h.id === "security") {
        const rxScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        const rxHTML = /<\/?[^>]+(>|$)/g;
        const rxSQL = /\b(UNION SELECT|DROP DATABASE|DROP TABLE|OR 1=1)\b/gi;
        let altered = false;
        
        if (rxScript.test(outText) || rxHTML.test(outText) || rxSQL.test(outText)) {
          altered = true;
          outText = outText.replace(rxScript, "[REMOVED_SCRIPT]");
          outText = outText.replace(rxHTML, " ");
          outText = outText.replace(rxSQL, "[BLOQUEADO_SQL]");
        }
        
        if (altered) {
          statusResult = "modified";
          logMsg = "Removidos scripts / SQL inyectados";
        } else {
          statusResult = "clean";
          logMsg = "Sin códigos de riesgo";
        }
      } 
      else if (h.id === "pii") {
        const rxEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const rxCard = /\b(?:\d[ -]*?){13,16}\b/g;
        let altered = false;

        if (rxEmail.test(outText) || rxCard.test(outText)) {
          altered = true;
          outText = outText.replace(rxEmail, (m) => m.split("@")[0].substring(0, 2) + "***@" + m.split("@")[1]);
          outText = outText.replace(rxCard, (m) => {
            const parsed = m.replace(/[-\s]/g, "");
            return `XXXX-XXXX-XXXX-${parsed.slice(-4)}`;
          });
        }

        if (altered) {
          statusResult = "modified";
          logMsg = "Emails y Tarjetas enmascarados";
        } else {
          statusResult = "clean";
          logMsg = "No se detectaron datos PII";
        }
      } 
      else if (h.id === "profanity") {
        const forbbiden = [
          { rx: /\b(idiota|inutil|inservible|estupido|basura|porqueria)\b/gi, rep: "🤬 [Censurado]" },
          { rx: /\b(falla|roto|defecto|malo)\b/gi, rep: "⚠️ anomalía" }
        ];
        let altered = false;
        for (const item of forbbiden) {
          if (item.rx.test(outText)) {
            altered = true;
            outText = outText.replace(item.rx, item.rep);
          }
        }

        if (altered) {
          statusResult = "modified";
          logMsg = "Reemplazadas groserías/agresiones";
        } else {
          statusResult = "clean";
          logMsg = "Español conforme y formal";
        }
      } 
      else if (h.id === "priority") {
        const rxCritical = /\b(urgente|colapso|estafa|fraude|caida|robado|critico|bloqueado)\b/gi;
        const rxHigh = /\b(ayuda|soporte|reclamo|error|problema|tarifa|demora)\b/gi;
        
        if (rxCritical.test(outText)) {
          tempPriority = "Crítica";
          statusResult = "critical";
          logMsg = "Prioridad Crítica detectada";
        } else if (rxHigh.test(outText)) {
          tempPriority = "Alta";
          statusResult = "high";
          logMsg = "Prioridad Alta detectada";
        } else {
          tempPriority = "Media";
          statusResult = "medium";
          logMsg = "Prioridad Media asignada";
        }
      }

      currentText = outText;
      stepsTrace.push({
        name: h.name,
        output: currentText,
        desc: h.desc,
        icon: h.icon,
        status: statusResult
      });
    });

    setExecutedSteps(stepsTrace);
  };

  const toggleHandler = (idx: number) => {
    const updated = [...handlersSetup];
    updated[idx].active = !updated[idx].active;
    setHandlersSetup(updated);
  };

  // Carga un ejemplo predeterminado
  const loadExample = (text: string) => {
    setInputText(text);
  };

  // Re-ejecutar automáticamente cuando cambie la configuración del pipeline o el texto
  useEffect(() => {
    handleExecuteChain();
  }, [handlersSetup, inputText]);

  return (
    <div id="ejemplo-aplicado" className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-6 font-sans shadow-xs animate-in fade-in duration-300">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" /> Ejemplo Aplicado: Pipeline de Seguridad CoR
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Demostración visual y real de una <strong>Cadena de Responsabilidad</strong> filtrando entradas inseguras de soporte. Puedes prender, apagar o alterar el flujo.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "sandbox" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="h-3.5 w-3.5" /> Sandbox Interactivo
          </button>
          <button
            onClick={() => setActiveTab("explicacion")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "explicacion" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Estructura de Clases
          </button>
        </div>
      </div>

      {activeTab === "sandbox" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Panel Izquierdo: Configuración del Pipeline y Templates (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Sección: Casos de Prueba Listos */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2.5">
                📝 Casos Académicos de Prueba
              </span>
              <div className="flex flex-col gap-2">
                {TEMPLATES.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(t.text)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition cursor-pointer flex flex-col gap-1 ${
                      inputText === t.text 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-medium" 
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-705 text-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="font-bold">{t.title}</strong>
                      {inputText === t.text && <Sparkles className="h-3 w-3 text-indigo-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight block">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sección: Controles de Eslabones de la Cadena */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  ⚙️ Configuración del Pipeline CoR
                </span>
                <button
                  onClick={() => setHandlersSetup(handlersSetup.map(h => ({ ...h, active: true })))}
                  className="text-[10px] text-indigo-600 hover:underline font-bold"
                >
                  Activar todos
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {handlersSetup.map((h, idx) => {
                  const Icon = h.icon;
                  return (
                    <div 
                      key={h.id} 
                      className={`flex items-start gap-3 p-2.5 rounded-lg border transition ${
                        h.active 
                          ? "bg-white border-slate-200 shadow-2xs" 
                          : "bg-slate-100/50 border-slate-200/50 opacity-60"
                      }`}
                    >
                      <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${h.active ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold block ${h.active ? "text-slate-800" : "text-slate-500 line-through"}`}>
                            {h.name}
                          </span>
                          
                          {/* Toggle Switch */}
                          <button
                            onClick={() => toggleHandler(idx)}
                            className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${
                              h.active ? "bg-indigo-600" : "bg-slate-300"
                            }`}
                          >
                            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-250 ${
                              h.active ? "translate-x-3.5" : "translate-x-0"
                            }`} />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{h.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex gap-2 mt-1">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-900 leading-normal">
                  <strong>Principio Abierto/Cerrado (OCP):</strong> Puedes apagar cualquiera de estos eslabones. El cliente sigue llamando al pipeline sin enterarse de qué filtros están activos. ¡Sin condicionales anidados!
                </p>
              </div>
            </div>

          </div>

          {/* Panel Derecho: Área de Prueba y Rastreo Visual (Col 7) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Cuadro de texto de entrada */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Mensaje de Entrada (Simula la solicitud del cliente)
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-[100px] bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:bg-white resize-none"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Escribe el mensaje sospechoso aquí..."
                />
                <button
                  onClick={() => setInputText("")}
                  className="absolute bottom-3 right-3 text-slate-400 hover:text-rose-600 shadow-2xs hover:bg-slate-100 p-1.5 rounded-lg transition"
                  title="Limpiar entrada"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Tracing Visual Microscópico (Paso a Paso) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                🧬 Inspección del Tránsito de la Cadena CoR
              </span>

              {executedSteps.length > 0 ? (
                <div className="space-y-3 relative border-l border-slate-200/80 pl-4 py-1 ml-2.5">
                  {executedSteps.map((step, idx) => {
                    const Icon = step.icon;
                    let pillBg = "bg-slate-100 text-slate-600 border-slate-200";

                    if (step.status === "modified") {
                      pillBg = "bg-amber-50 text-amber-700 border-amber-200";
                    } else if (step.status === "rejected") {
                      pillBg = "bg-rose-50 text-rose-700 border-rose-200";
                    } else if (step.status === "approved" || step.status === "clean") {
                      pillBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    } else if (["critical", "high"].includes(step.status)) {
                      pillBg = "bg-rose-50 border-rose-200 text-rose-700";
                    }

                    return (
                      <div key={idx} className="relative group animate-in fade-in slide-in-from-left-2 duration-300">
                        {/* Conector circular */}
                        <div className={`absolute -left-[24.5px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center text-[9px] font-bold shadow-4xs ${
                          step.status === "modified" || step.status === "rejected" ? "border-amber-500" : "border-indigo-600"
                        }`}>
                          {idx + 1}
                        </div>

                        <div className="bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-200/80 transition flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 text-slate-500" />
                              <span className="text-xs font-bold text-slate-800">{step.name}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${pillBg}`}>
                              {step.desc}
                            </span>
                          </div>

                          {/* Preview del texto en este eslabón */}
                          <div className="bg-white px-2.5 py-1.5 rounded border border-slate-200/65 text-[10.5px] font-mono text-slate-700 break-words leading-tight shadow-3xs max-h-[50px] overflow-y-auto">
                            {step.output}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-slate-50">
                  Ningún eslabón se encuentra activo en el pipeline de seguridad actualmente.
                </div>
              )}
            </div>

            {/* Resultado Final de la Ejecución */}
            {result && (
              <div className="bg-indigo-50/45 border border-indigo-200/70 p-4.5 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-indigo-200/30 pb-2">
                  <span className="text-[10px] font-bold text-indigo-850 text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    🚀 Contenido de Salida Definitivo
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Prioridad:</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono border ${
                      result.priority === "Crítica" ? "bg-rose-50 border-rose-200 text-rose-700" :
                      result.priority === "Alta" ? "bg-amber-50 border-amber-200 text-amber-700" :
                      "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}>
                      {result.priority}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Estado:</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono border ${
                      result.status === "rejected" ? "bg-rose-55 bg-rose-50 border-rose-200 text-rose-700" :
                      result.status === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" :
                      "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-indigo-100 font-mono text-xs text-slate-900 leading-relaxed break-words shadow-2xs">
                  {result.text}
                </div>

                {/* Tags de metadatos procesados */}
                <div className="flex flex-wrap gap-2 text-[9px] font-bold">
                  <span className={`px-2.5 py-0.8 rounded-md border ${result.metadata.scriptsDetected ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-slate-105 bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {result.metadata.scriptsDetected ? "🛡️ Script Neutralizado" : "🛡️ Sin Scripts"}
                  </span>
                  <span className={`px-2.5 py-0.8 rounded-md border ${result.metadata.piiMasked ? "bg-amber-55 bg-amber-50 border-amber-200 text-amber-700" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {result.metadata.piiMasked ? "📧 Datos PII Protegidos" : "📧 Sin Datos PII"}
                  </span>
                  <span className={`px-2.5 py-0.8 rounded-md border ${result.metadata.hasProfanity ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {result.metadata.hasProfanity ? "🤐 Lenguaje Sanitizado" : "🤐 Lenguaje Adecuado"}
                  </span>
                  <span className="px-2.5 py-0.8 rounded-md border bg-indigo-100 text-indigo-700 border-indigo-200 ml-auto">
                    {result.metadata.charCount} Caracteres • {result.metadata.wordCount} Palabras
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Pestaña: Estructura de Clases del Ejemplo en la Carpeta */
        <div className="flex flex-col gap-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-indigo-600" /> Archivo Independiente: <code>src/components/DemoPatron/ChainOfResponsibility.ts</code>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hemos modularizado la lógica de validación de seguridad usando la rúbrica formal del patrón. Cada regla tiene una clase dedicada que hereda de <code>BaseHandler</code>. Esto desacopla las reglas de negocio y evita usar estructuras condicionales compuestas en el servicio de recepción de solicitudes.
            </p>

            <pre className="text-[11px] font-mono bg-white p-4 rounded-lg border border-slate-200 text-slate-800 leading-relaxed max-h-[350px] overflow-y-auto shadow-inner">
{`// 1. Definición obligatoria de la Interfaz del Patrón
export interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: MessageRequest): MessageRequest;
}

// 2. Clase de Soporte Abstracta (Delegador Recursivo)
export abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: MessageRequest): MessageRequest {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return request;
  }
}

// 3. Eslabón Concreta 1: Sanitización de Código e inyecciones
export class SecuritySanitizationHandler extends BaseHandler {
  public override handle(request: MessageRequest): MessageRequest {
    // Busca scripts HTML, si detecta los altera y sigue en la cadena
    if (contieneMensajesMaliciosos(request.text)) {
      request.text = sanitizar(request.text);
      request.metadata.scriptsDetected = true;
    }
    return super.handle(request); // Pasa la posta al siguiente eslabón
  }
}`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Beneficios bajo Rúbrica de la Clase</span>
              <ul className="text-xs text-slate-705 text-slate-750 text-slate-700 space-y-2 list-disc pl-4">
                <li><strong>Mantenibilidad:</strong> Si mañana el profesor solicita agregar un filtro para detectar spam de enlaces, creamos una clase <code>LinkSpamHandler</code>, heredamos de <code>BaseHandler</code> y lo agregamos en serie, sin reescribir nada más.</li>
                <li><strong>Desacoplamiento:</strong> El componente visual de la página web solo manda a procesar el texto y el pipeline se encarga de resolverlo.</li>
              </ul>
            </div>

            <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
              <span className="text-xs font-bold text-sky-800 uppercase block mb-1">Dinámica UPC</span>
              <p className="text-xs text-slate-700 leading-normal">
                Este pipeline de seguridad simula un backend de producción que cumple con la normativa de protección de datos (PII - GDPR) y filtrado automático de entrada de datos en sistemas gubernamentales o corporativos antes de ser guardadas en la base de datos.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
