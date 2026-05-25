import { useState } from "react";
import { BookOpen, Layers, Activity, Code, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";

import PresentationSlides from "./components/PresentationSlides";
import InteractiveUML from "./components/InteractiveUML";
import VisualSimulator from "./components/VisualSimulator";
import CodeViewer from "./components/CodeViewer";
import InteractiveExercise from "./components/InteractiveExercise";

type SectionTab = "presentacion" | "uml" | "simulador" | "codigo" | "talleres";

export default function App() {
  const [activeTab, setActiveTab] = useState<SectionTab>("presentacion");

  const tabItems = [
    { id: "presentacion" as SectionTab, label: "Presentación (Diapo)", icon: BookOpen },
    { id: "uml" as SectionTab, label: "Diagrama UML clases", icon: Layers },
    { id: "simulador" as SectionTab, label: "Simulador de Flujo", icon: Activity },
    { id: "codigo" as SectionTab, label: "Workbench Código (IDE)", icon: Code },
    { id: "talleres" as SectionTab, label: "Taller Académico", icon: GraduationCap }
  ];

  // Permite saltar entre secciones de forma dinámica desde los slides interactivos
  const handleGoToSection = (sectionId: string) => {
    if (sectionId === "simulador") {
      setActiveTab("simulador");
    } else if (sectionId === "diagrama-uml") {
      setActiveTab("uml");
    } else if (sectionId === "ejercicios") {
      setActiveTab("talleres");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      
      {/* Glows de fondo decorativos de Immersive UI */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Cabecera Principal */}
      <header className="border-b border-slate-800/80 bg-[#0f172a]/80 sticky top-0 z-50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
              CoR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold uppercase tracking-widest text-slate-100">Chain of Responsibility</h1>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.2 rounded border border-indigo-500/30">
                  UPC 2026
                </span>
              </div>
              <span className="text-xs text-slate-500 block leading-none">
                Especialización en Ingeniería de Software ─ Patrones de Diseño
              </span>
            </div>
          </div>

          {/* Menú de Navegación de Pestañas con estilo Immersive UI */}
          <nav className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {tabItems.map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-sans"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Contenido Principal (Layout Adaptable) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start z-10 relative">
        
        {/* Esfera de Contenido Dinámico (Slide, UML, Simulador, etc) */}
        <section className="xl:col-span-9 flex flex-col gap-6">
          {activeTab === "presentacion" && (
            <PresentationSlides onGoToSection={handleGoToSection} />
          )}
          {activeTab === "uml" && (
            <InteractiveUML />
          )}
          {activeTab === "simulador" && (
            <VisualSimulator />
          )}
          {activeTab === "codigo" && (
            <CodeViewer />
          )}
          {activeTab === "talleres" && (
            <InteractiveExercise />
          )}
        </section>

        {/* Sidebar Lateral: Rúbrica de la Defensa */}
        <aside className="xl:col-span-3 sticky top-[95px]">
          <div className="flex flex-col gap-5">
            {/* Checkbox de Rúbricas Académicas Completadas */}
            <div className="bg-[#0f172a]/50 p-4.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-400" /> Lista de Evaluación Rúbrica UPC
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {[
                  { check: true, label: "Nombre del Patrón (Esp/Ing)" },
                  { check: true, label: "Problema Resuelto (Evitar malas prácticas)" },
                  { check: true, label: "Intención del Patrón (Frase de resumen)" },
                  { check: true, label: "Contexto de Uso (Especialista en ruteo)" },
                  { check: true, label: "Diagrama de Clases UML Inteligente" },
                  { check: true, label: "Explicación Paso a Paso (Trace del flujo)" },
                  { check: true, label: "Ejemplo del Problema (Soporte Técnico)" },
                  { check: true, label: "Código de Ejemplo (Clases Separadas)" },
                  { check: true, label: "Análisis de Ventajas y Desventajas" },
                  { check: true, label: "Taller Práctico con Respuestas de Reflexión" }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-slate-800/80 bg-[#020617] py-6 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Universidad Popular del Cesar • Especialización en Ingeniería de Software. Actividad de Aprendizaje Unidad 3.
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diseñado para Defensa de 45 minutos</span>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">Estado: Listo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
