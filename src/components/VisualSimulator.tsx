import { useState, useEffect, FormEvent } from "react";
import { Play, SkipForward, RotateCcw, AlertOctagon, CheckCircle2, ArrowRight, CornerDownRight, Plus, HelpCircle } from "lucide-react";
import { SimulationRequest, HandlerNode } from "../types";

const PRESETS: Omit<SimulationRequest, "status" | "history">[] = [
  {
    id: "req1",
    title: "Problema con mouse inalámbrico",
    difficulty: "Bajo",
    description: "El estudiante reporta que el mouse óptico de su escritorio no enciende tras cambiar las baterías."
  },
  {
    id: "req2",
    title: "Acceso denegado a base de datos de pruebas",
    difficulty: "Medio",
    description: "Un analista senior necesita conectarse a la base de pruebas de Oracle, pero su clave corporativa devuelve error ORA-01017."
  },
  {
    id: "req3",
    title: "Despliegue fallido y caída de microservicio",
    difficulty: "Alto",
    description: "El pipeline de CI/CD falló al compilar la imagen Docker en producción, deteniendo el microservicio de facturación."
  },
  {
    id: "req4",
    title: "Presunta filtración de datos sensibles",
    difficulty: "Crítico",
    description: "Monitoreo alerta de descargas masivas inusuales desde una IP externa no autorizada en el bucket S3 corporativo."
  }
];

const HANDLERS: HandlerNode[] = [
  {
    id: "h1",
    name: "Técnico Junior (Nivel 1)",
    title: "Atención de Campo",
    level: "Junior",
    canHandleRegex: "Bajo",
    description: "Soporte de hardware básico, instalaciones menores, restablecimiento de accesos iniciales y tareas operativas simples.",
    capabilities: ["Problemas de periféricos", "Instalación de software básico", "Limpieza física"]
  },
  {
    id: "h2",
    name: "Especialista TI (Nivel 2)",
    title: "Soporte Avanzado",
    level: "Senior",
    canHandleRegex: "Bajo|Medio",
    description: "Configuraciones de red locales, resolución de errores de sistemas operativos, y debugging de software empresarial estándar.",
    capabilities: ["Conexión a base de datos", "Errores ORA-XXXX", "Configuración VPN", "Accesos Active Directory"]
  },
  {
    id: "h3",
    name: "Líder DevOps / Infra (Nivel 3)",
    title: "Soporte de Platino",
    level: "Soporte Especializado",
    canHandleRegex: "Bajo|Medio|Alto",
    description: "Servicios en la nube, servidores locales, pipelines e infraestructura crítica de la compañía.",
    capabilities: ["Pipelines fallidos", "Reinicio de Kubernetes", "Docker Cloud / S3", "Parches de urgencia"]
  },
  {
    id: "h4",
    name: "Director de TI / CISO (Nivel 4)",
    title: "Comité de Crisis",
    level: "Manager",
    canHandleRegex: "Bajo|Medio|Alto|Crítico",
    description: "Incidentes de alta gravedad, brechas de seguridad, deudas técnicas de alto impacto y autorizaciones corporativas.",
    capabilities: ["Brechas de seguridad", "Ciberataques / Ransomware", "Pérdida de datos masiva", "Decisiones financieras"]
  }
];

export default function VisualSimulator() {
  const [tickets, setTickets] = useState<SimulationRequest[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [playbackMode, setPlaybackMode] = useState<"idle" | "playing" | "step">("idle");
  const [customTitle, setCustomTitle] = useState("");
  const [customDiff, setCustomDiff] = useState<"Bajo" | "Medio" | "Alto" | "Crítico">("Bajo");
  const [customDesc, setCustomDesc] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Inicializar cargando los presets
  useEffect(() => {
    resetAll();
  }, []);

  const resetAll = () => {
    const initialized = PRESETS.map(p => ({
      ...p,
      status: "idle" as const,
      history: []
    }));
    setTickets(initialized);
    setSelectedTicketId(initialized[0].id);
    setActiveStep(-1);
    setPlaybackMode("idle");
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Crear ticket personalizado
  const handleCreateCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newTicket: SimulationRequest = {
      id: "custom_" + Date.now(),
      title: customTitle,
      difficulty: customDiff,
      description: customDesc || "Sin descripción adicional.",
      status: "idle",
      history: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setShowCustomForm(false);
    // Limpiar campos
    setCustomTitle("");
    setCustomDesc("");
    setActiveStep(-1);
    setPlaybackMode("idle");
  };

  // Función para evaluar un paso de la cadena
  const handleNextStep = () => {
    if (!selectedTicket) return;

    let nextStepIndex = activeStep + 1;
    if (nextStepIndex >= HANDLERS.length) {
      // Fin de la cadena y nadie pudo manejarlo
      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicketId
            ? { ...t, status: "unhandled" }
            : t
        )
      );
      setPlaybackMode("idle");
      return;
    }

    const currentHandler = HANDLERS[nextStepIndex];
    const regex = new RegExp(currentHandler.canHandleRegex);
    const canProcess = regex.test(selectedTicket.difficulty);

    const isBajo = selectedTicket.difficulty === "Bajo";
    const isMedio = selectedTicket.difficulty === "Medio";
    const isAlto = selectedTicket.difficulty === "Alto";
    const isCritico = selectedTicket.difficulty === "Crítico";

    let action: "check" | "handle" | "forward" = "check";
    let message = "";

    if (canProcess) {
      action = "handle";
      message = `✅ ${currentHandler.name} resolvió con éxito el incidente de nivel ${selectedTicket.difficulty}. Acciones aplicadas según sus capacidades.`;
    } else {
      action = "forward";
      message = `❌ ${currentHandler.name} (Atribución máx: ${currentHandler.canHandleRegex.replace("|", ", ")}) carece de atribución para dificultad ${selectedTicket.difficulty}. Transfiriendo petición de forma segura...`;
    }

    // Actualizar historial y estado del ticket
    setTickets(prev =>
      prev.map(t => {
        if (t.id === selectedTicketId) {
          const newHistory = [...t.history, { handlerId: currentHandler.id, action, message }];
          const finalStatus = canProcess ? ("handled" as const) : (nextStepIndex === HANDLERS.length - 1 ? ("unhandled" as const) : ("evaluating" as const));
          return {
            ...t,
            status: finalStatus,
            currentHandlerId: canProcess ? undefined : (nextStepIndex === HANDLERS.length - 1 ? undefined : HANDLERS[nextStepIndex + 1].id),
            handledBy: canProcess ? currentHandler.name : undefined,
            history: newHistory
          };
        }
        return t;
      })
    );

    setActiveStep(nextStepIndex);

    if (canProcess) {
      setPlaybackMode("idle");
    }
  };

  // Iniciar reproducción automática
  useEffect(() => {
    if (playbackMode !== "playing") return;

    const timer = setTimeout(() => {
      if (!selectedTicket || selectedTicket.status === "handled" || selectedTicket.status === "unhandled") {
        setPlaybackMode("idle");
        return;
      }
      handleNextStep();
    }, 1800);

    return () => clearTimeout(timer);
  }, [playbackMode, activeStep, selectedTicketId]);

  const startPlaying = () => {
    if (!selectedTicket) return;
    // Si ya fue completado, reiniciarlo antes de reproducir
    if (selectedTicket.status === "handled" || selectedTicket.status === "unhandled" || selectedTicket.history.length > 0) {
      restartTicketSimulation();
      setActiveStep(-1);
    }
    setPlaybackMode("playing");
  };

  const restartTicketSimulation = () => {
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? { ...t, status: "idle", currentHandlerId: undefined, handledBy: undefined, history: [] }
          : t
      )
    );
    setActiveStep(-1);
    setPlaybackMode("idle");
  };

  return (
    <div id="simulador-cadena" className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-indigo-400 mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span> Flujo de Ejecución Trácing Visual
          </h4>
          <p className="text-xs text-slate-400">
            Experimenta en tiempo real cómo viaja una solicitud a través de la cadena de eslabones y quién la intercepta.
          </p>
        </div>

        {/* Controles rápidos */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="flex-1 md:flex-initial py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold rounded-lg border border-slate-750 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Agregar Caso Real
          </button>
          <button
            onClick={resetAll}
            className="py-1.5 px-3 bg-slate-805 hover:bg-slate-700 text-xs text-slate-300 font-medium rounded-lg border border-slate-750 flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Restablecer todos los ejemplos"
          >
            <RotateCcw className="h-4.5 w-4.5" /> Reset
          </button>
        </div>
      </div>

      {/* Formulario de caso personalizado */}
      {showCustomForm && (
        <form onSubmit={handleCreateCustom} className="bg-slate-950 p-4 rounded-lg border border-indigo-900/40 grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in-25 duration-200">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre del Incidente</label>
            <input
              type="text"
              required
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              placeholder="Ej: Problema con switch core"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-405 text-slate-400 uppercase tracking-widest mb-1">Dificultad</label>
            <select
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded px-2 py-1.4 text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
              value={customDiff}
              onChange={e => setCustomDiff(e.target.value as any)}
            >
              <option value="Bajo">Bajo (Nivel 1)</option>
              <option value="Medio">Medio (Nivel 2)</option>
              <option value="Alto">Alto (Nivel 3)</option>
              <option value="Crítico">Crítico (Nivel 4)</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Descripción del Incidente / Detalle técnico</label>
            <input
              type="text"
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              placeholder="Ej: El conmutador principal de Cisco parpadea con luz roja..."
              value={customDesc}
              onChange={e => setCustomDesc(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded transition uppercase tracking-wider cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </form>
      )}

      {/* Selector de Casos y Panel Informativo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        {/* Selector Izquierdo */}
        <div className="lg:col-span-1 border-r-0 lg:border-r border-slate-800 pr-0 lg:pr-4 flex flex-col gap-2.5">
          <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tickets / Solicitudes</h5>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
            {tickets.map(t => {
              let diffColor = "bg-slate-900 text-slate-400";
              if (t.difficulty === "Bajo") diffColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10";
              else if (t.difficulty === "Medio") diffColor = "bg-sky-500/10 text-sky-400 border border-sky-500/10";
              else if (t.difficulty === "Alto") diffColor = "bg-amber-500/10 text-amber-400 border border-amber-500/10";
              else if (t.difficulty === "Crítico") diffColor = "bg-rose-500/10 text-rose-400 border border-rose-500/10";

              const isSelected = t.id === selectedTicketId;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTicketId(t.id);
                    setActiveStep(-1);
                    setPlaybackMode("idle");
                  }}
                  className={`text-left p-2.5 rounded-lg border transition cursor-pointer ${isSelected ? "bg-indigo-600/10 border-indigo-505 border-indigo-500/70 shadow-md shadow-indigo-600/5" : "bg-slate-900/40 border-transparent hover:border-slate-800"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase leading-none font-mono tracking-wide bg-slate-800 text-slate-300">
                      Incidente
                    </span>
                    <span className={`text-[9px] font-bold px-1 py-0.2 rounded font-mono uppercase ${diffColor}`}>
                      {t.difficulty}
                    </span>
                  </div>
                  <h6 className="text-xs font-semibold text-slate-200 truncate">{t.title}</h6>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de Incidente Activo */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {selectedTicket ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-sm text-slate-200">{selectedTicket.title}</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Dificultad</span>
                  <span className={`text-xs font-bold font-mono uppercase ${
                    selectedTicket.difficulty === "Bajo" ? "text-emerald-400" :
                    selectedTicket.difficulty === "Medio" ? "text-sky-400" :
                    selectedTicket.difficulty === "Alto" ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {selectedTicket.difficulty}
                  </span>
                </div>
              </div>

              {/* Botones de Control de la Simulación */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-805 border-slate-800 p-2.5 rounded-lg mt-2 font-sans">
                <button
                  onClick={startPlaying}
                  disabled={playbackMode === "playing" || selectedTicket.status === "handled"}
                  className={`text-xs font-bold py-1.5 px-3 rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                    playbackMode === "playing"
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  <Play className="h-4 w-4" /> Simular Flujo Completo
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={playbackMode === "playing" || selectedTicket.status === "handled" || selectedTicket.status === "unhandled"}
                  className="text-xs font-bold py-1.5 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-750 flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <SkipForward className="h-4 w-4" /> Ejecutar un Paso
                </button>

                <button
                  onClick={restartTicketSimulation}
                  disabled={selectedTicket.history.length === 0}
                  className="text-xs font-bold py-1.5 px-3 rounded-md bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Rebobinar Canal
                </button>

                {/* Badge de estado del ticket */}
                <div className="ml-auto">
                  {selectedTicket.status === "handled" && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Resuelto por {selectedTicket.handledBy}
                    </div>
                  )}
                  {selectedTicket.status === "unhandled" && (
                    <div className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 font-bold">
                      <AlertOctagon className="h-4 w-4" /> Nadie pudo resolverlo
                    </div>
                  )}
                  {selectedTicket.status === "evaluating" && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 font-bold animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span> Evaluando en cadena...
                    </div>
                  )}
                  {selectedTicket.status === "idle" && (
                    <span className="text-[10px] text-slate-500 font-bold font-mono uppercase bg-slate-800 px-2 py-1 rounded block">
                      Listo en cola
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">Selecciona un ticket para comenzar</div>
          )}
        </div>
      </div>

      {/* Visualización física de la cadena de manejadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {HANDLERS.map((handler, idx) => {
          const isCurrentEvaluator = selectedTicket && selectedTicket.history.some(h => h.handlerId === handler.id) || (idx === activeStep + 1 && playbackMode !== "idle" && selectedTicket?.status === "evaluating");
          const hasCheckedThisNode = selectedTicket && selectedTicket.history.some(h => h.handlerId === handler.id);
          const wasHandledHere = selectedTicket && selectedTicket.history.some(h => h.handlerId === handler.id && h.action === "handle");
          const isPending = selectedTicket && !selectedTicket.history.some(h => h.handlerId === handler.id) && activeStep < idx;

          // Clases CSS dinámicas para pintar el nodo de acuerdo a su estado en el tracing
          let borderClass = "border-slate-800 bg-slate-950/40 opacity-55";
          let shadowClass = "";
          let badgeColor = "bg-slate-900 text-slate-400";
          let activeGlowText = "text-slate-400";

          if (wasHandledHere) {
            borderClass = "border-emerald-500 bg-emerald-950/40 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
            badgeColor = "bg-emerald-500 text-slate-950";
            activeGlowText = "text-emerald-300 font-bold";
          } else if (hasCheckedThisNode) {
            borderClass = "border-amber-500 bg-amber-950/20 opacity-80";
            badgeColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
            activeGlowText = "text-amber-400";
          } else if (idx === activeStep + 1 && selectedTicket && selectedTicket.status === "evaluating") {
            borderClass = "border-indigo-400 bg-slate-900 opacity-100 ring-2 ring-indigo-500/50 animate-pulse";
            badgeColor = "bg-indigo-600 text-white";
            activeGlowText = "text-indigo-300 font-bold";
          } else if (!isPending) {
            borderClass = "border-slate-800 bg-slate-950 opacity-100";
          }

          return (
            <div
              key={handler.id}
              className={`flex flex-col justify-between p-4 rounded-xl border relative transition-all duration-300 ${borderClass}`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase leading-none font-mono ${badgeColor}`}>
                    Nivel {idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 font-mono">
                    Regex: {handler.canHandleRegex}
                  </span>
                </div>

                <h6 className="font-bold text-slate-100 text-sm">{handler.name}</h6>
                <span className="text-[10px] font-semibold text-slate-500 block mb-2">{handler.title}</span>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {handler.description}
                </p>

                {/* Capacidades */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Capacidades:</span>
                  <div className="flex flex-wrap gap-1">
                    {handler.capabilities.map(cap => (
                      <span key={cap} className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-medium">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conector Flecha (siguiente eslabón) */}
              {idx < HANDLERS.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-800 items-center justify-center text-slate-400 border border-slate-700">
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal de Trace Logs en vivo */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2 relative">
        <div className="flex justify-between items-center border-b border-slate-805/85 border-slate-800 pb-2 mb-1.5">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-ping"></span> LOG DE SEGUIMIENTO (CADENA DE LLAMADAS)
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {selectedTicket ? `${selectedTicket.history.length}/${HANDLERS.length} eslabones procesados` : ""}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 font-mono text-[11px] max-h-[140px] overflow-y-auto leading-relaxed text-slate-300 p-1">
          {selectedTicket && selectedTicket.history.length > 0 ? (
            selectedTicket.history.map((log, idx) => (
              <div key={idx} className="flex gap-1.5 items-start">
                <span className="text-slate-500">[{idx + 1}]</span>
                <span className={log.action === "handle" ? "text-emerald-400 font-bold" : log.action === "forward" ? "text-slate-400" : "text-slate-500"}>
                  {log.message}
                </span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic text-center py-2 flex items-center justify-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> Inicia la simulación para inspeccionar el flujo de llamadas recursivas en vivo.
            </div>
          )}

          {/* Siguiente manejador pendiente */}
          {selectedTicket && selectedTicket.status === "evaluating" && activeStep + 1 < HANDLERS.length && (
            <div className="flex gap-1.5 items-center text-indigo-400 font-semibold animate-pulse pl-1">
              <CornerDownRight className="h-3 w-3" />
              <span>Siguiente en cola: {HANDLERS[activeStep + 1].name}...</span>
            </div>
          )}

          {/* Resultado Final Terminal */}
          {selectedTicket && selectedTicket.status === "handled" && (
            <div className="border-t border-emerald-950/50 mt-1.5 pt-1.5 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <span>💎 [PROCESO TERMINADO] El ticket ha sido resuelto y cancelado en la base de datos de soporte.</span>
            </div>
          )}
          {selectedTicket && selectedTicket.status === "unhandled" && (
            <div className="border-t border-rose-950/50 mt-1.5 pt-1.5 text-rose-400 font-bold text-xs flex items-center gap-1.5">
              <span>⚠️ [FIN DE CADENA] Ningún manejador calificado pudo resolver el incidente. Escalando a Soporte Core Externo.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
