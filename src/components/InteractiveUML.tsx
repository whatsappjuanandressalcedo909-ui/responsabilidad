import { useState } from "react";
import { Shield, GitCommit, Settings, Layers, Code, Play } from "lucide-react";

interface UMLNode {
  id: string;
  name: string;
  type: "Interface" | "Abstract" | "Concrete" | "Client";
  description: string;
  responsibilities: string[];
  methods: string[];
  attributes: string[];
  codeJava: string;
  codeTS: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function InteractiveUML() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("handler");
  const [lang, setLang] = useState<"java" | "ts">("java");

  const nodes: UMLNode[] = [
    {
      id: "client",
      name: "Client (Cliente)",
      type: "Client",
      description: "Inicia la petición y configura la cadena de responsabilidad uniendo los manejadores según el flujo de negocio.",
      responsibilities: [
        "Instancia los manejadores concretos.",
        "Ensambla la cadena vinculando un manejador al siguiente (p. ej., h1.setNext(h2)).",
        "Envía la petición o solicitud al primer eslabón de la cadena."
      ],
      attributes: [],
      methods: ["main()", "ejecutarFlujo()"],
      codeJava: `// Ejemplo Client en Java
public class Main {
    public static void main(String[] args) {
        // 1. Crear los eslabones
        Handler soporteN1 = new SoporteNivel1();
        Handler soporteN2 = new SoporteNivel2();
        Handler gerente = new GerenteSoporte();

        // 2. Configurar el orden de la cadena
        soporteN1.setNext(soporteN2).setNext(gerente);

        // 3. Enviar peticiones al primer elemento
        Request ticket1 = new Request("Bajo", "Resetear contraseña");
        Request ticket2 = new Request("Alto", "Base de datos caída");

        soporteN1.handle(ticket1);
        soporteN1.handle(ticket2);
    }
}`,
      codeTS: `// Ejemplo Client en TypeScript
const soporteN1 = new SoporteNivel1();
const soporteN2 = new SoporteNivel2();
const gerente = new GerenteSoporte();

// Configurar la cadena de responsabilidad
soporteN1.setNext(soporteN2).setNext(gerente);

// Enviar peticiones
const ticket1 = new Request("Bajo", "Cambio de clave");
soporteN1.handle(ticket1);`,
      x: 30,
      y: 40,
      width: 200,
      height: 110
    },
    {
      id: "handler",
      name: "Manejador (Handler)",
      type: "Interface",
      description: "Define el contrato base e interfaz para todos los manejadores concretos de la cadena y el método para establecer el sucesor.",
      responsibilities: [
        "Declara la operación para procesar peticiones.",
        "Declara el método para configurar la siguiente referencia (setNext).",
        "Asegura la compatibilidad de tipos polimórfica en toda la cadena."
      ],
      attributes: [],
      methods: ["Handler setNext(Handler next)", "void handle(Request request)"],
      codeJava: `// Interfaz en Java
public interface Handler {
    Handler setNext(Handler next);
    void handle(Request request);
}`,
      codeTS: `// Interfaz o Clase Abstracta en TypeScript
export interface Handler {
    setNext(next: Handler): Handler;
    handle(request: Request): void;
}`,
      x: 340,
      y: 40,
      width: 220,
      height: 110
    },
    {
      id: "baseHandler",
      name: "Manejador Base (BaseHandler)",
      type: "Abstract",
      description: "Implementación por defecto opcional para almacenar la referencia al siguiente manejador y delegar recursivamente.",
      responsibilities: [
        "Mantiene una variable privada/protegida 'next' que apunta al siguiente manejador.",
        "Implementa 'setNext' guardando el sucesor y retornándolo para permitir encadenamiento fluido.",
        "Implementa 'handle' por defecto, delegando al sucesor si existe."
      ],
      attributes: ["protected Handler next"],
      methods: ["Handler setNext(Handler next)", "void handle(Request request)"],
      codeJava: `// Clase abstracta intermedia en Java
public abstract class BaseHandler implements Handler {
    protected Handler next;

    @Override
    public Handler setNext(Handler next) {
        this.next = next;
        return next; // Facilita la inicialización fluida h1.setNext(h2).setNext(h3);
    }

    @Override
    public void handle(Request req) {
        if (this.next != null) {
            this.next.handle(req); // Delegación automática predefinida
        }
    }
}`,
      codeTS: `// Clase abstracta base en TypeScript
export abstract class BaseHandler implements Handler {
    protected next: Handler | null = null;

    public setNext(next: Handler): Handler {
        this.next = next;
        return next;
    }

    public handle(request: Request): void {
        if (this.next) {
            this.next.handle(request);
        }
    }
}`,
      x: 340,
      y: 210,
      width: 220,
      height: 130
    },
    {
      id: "concreteA",
      name: "Manejador Concreto A (Soporte N1)",
      type: "Concrete",
      description: "Manejador de primera línea. Evalúa si posee los conocimientos técnicos para resolver el problema, sino delega al siguiente.",
      responsibilities: [
        "Determina si puede resolver la petición actual basados en su dificultad ('Bajo').",
        "Resuelve el problema imprimiendo el resultado o cambiando el estado de la petición.",
        "Si no puede resolverlo o la dificultad es mayor, delega explícitamente llamando a super.handle(request)."
      ],
      attributes: [],
      methods: ["void handle(Request req)"],
      codeJava: `// Manejador específico en Java
public class SoporteNivel1 extends BaseHandler {
    @Override
    public void handle(Request req) {
        if (req.getDificultad().equals("Bajo")) {
            System.out.println("Nivel 1 resolvió: " + req.getDescripcion());
        } else {
            System.out.println("Nivel 1 no pudo resolver. Pasando...");
            super.handle(req); // Delegar al siguiente en la cadena
        }
    }
}`,
      codeTS: `// Manejador en TypeScript
export class SoporteNivel1 extends BaseHandler {
    public handle(req: Request): void {
        if (req.dificultad === "Bajo") {
            console.log(\`[Nivel 1] Resuelto: \${req.descripcion}\`);
        } else {
            console.log("[Nivel 1] Dificultad alta. Derivando...");
            super.handle(req);
        }
    }
}`,
      x: 180,
      y: 400,
      width: 250,
      height: 110
    },
    {
      id: "concreteB",
      name: "Manejador Concreto B (Soporte N2 / Especialista)",
      type: "Concrete",
      description: "Manejador de segunda línea. Diseñado para resolver casos intermedios de mediana complejidad que el primer nivel no pudo descifrar.",
      responsibilities: [
        "Evalúa si el incidente califica como dificultad 'Medio'.",
        "Resuelve incidentes que involucran configuraciones, accesos intermedios o bugs conocidos.",
        "Invoca la delegación al sucesor si la dificultad supera su límite de competencia ('Alto' o 'Crítico')."
      ],
      attributes: [],
      methods: ["void handle(Request req)"],
      codeJava: `// Manejador de Nivel 2 en Java
public class SoporteNivel2 extends BaseHandler {
    @Override
    public void handle(Request req) {
        if (req.getDificultad().equals("Medio")) {
            System.out.println("Nivel 2 (Especialista) resolvió: " + req.getDescripcion());
        } else {
            System.out.println("Nivel 2 derivando al siguiente nivel...");
            super.handle(req);
        }
    }
}`,
      codeTS: `// Manejador de Nivel 2 en TypeScript
export class SoporteNivel2 extends BaseHandler {
    public handle(req: Request): void {
        if (req.dificultad === "Medio") {
            console.log(\`[Nivel 2] Resolvió: \${req.descripcion}\`);
        } else {
            super.handle(req);
        }
    }
}`,
      x: 470,
      y: 400,
      width: 250,
      height: 110
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[1];

  return (
    <div id="uml-interactivo" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      {/* Columna Izquierda: Diagrama Interactivo */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-indigo-400 mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span> Diagrama UML de Clases Interactivo
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Selecciona un componente del diagrama para auditar sus responsabilidades, relaciones e implementaciones de código.
          </p>
        </div>

        {/* Contenedor del SVG adaptable */}
        <div className="relative border border-slate-800 rounded-lg bg-slate-950 p-2 overflow-x-auto select-none font-sans">
          <svg viewBox="0 0 760 550" className="w-full min-w-[700px] h-[480px]">
            {/* Definiciones de Flechas y Gradientes */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker id="generalize" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <polygon points="0,0 10,5 0,10" fill="none" stroke="#64748b" strokeWidth="1.5" />
              </marker>
              <marker id="realize" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <polygon points="0,0 10,5 0,10" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              </marker>
              <linearGradient id="selectedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Relación: Cliente -> Handler (Asociación) */}
            <line x1="230" y1="95" x2="330" y2="95" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            <text x="245" y="85" fill="#94a3b8" className="text-[10px] font-semibold">Instancia y usa</text>

            {/* Relación: BaseHandler realiza Handler (Implementación de interfaz) */}
            <line x1="450" y1="150" x2="450" y2="200" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#realize)" />
            <text x="458" y="180" fill="#818cf8" className="text-[10px] font-bold">implements</text>

            {/* Relación de Recursividad: BaseHandler tiene referencia next (Sucesión) */}
            <path d="M 560 235 L 610 235 L 610 290 L 570 290" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="618" y="260" fill="#fda4af" className="text-[10px] font-bold">next: Handler</text>

            {/* Relaciones de Herencia: ConcreteA y ConcreteB extiendan BaseHandler */}
            <path d="M 305 400 L 305 370 L 450 370 L 450 350" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#generalize)" />
            <path d="M 595 400 L 595 370 L 450 370 L 450 350" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#generalize)" />
            <text x="350" y="382" fill="#60a5fa" className="text-[10px] font-semibold">extends (hereda campos y fallback)</text>

            {/* Dibuja los Nodos */}
            {nodes.map(node => {
              const isSelected = node.id === selectedNodeId;
              const isInterface = node.type === "Interface";
              const isAbstract = node.type === "Abstract";
              const isClient = node.type === "Client";

              let strokeColor = "stroke-slate-700";
              let headerColor = "bg-slate-800 text-slate-300";
              let titleColor = "text-slate-200";

              if (isSelected) {
                strokeColor = "stroke-indigo-500";
                headerColor = "bg-indigo-500/20 text-indigo-300";
              } else {
                if (isInterface) strokeColor = "stroke-indigo-700";
                else if (isAbstract) strokeColor = "stroke-purple-700";
                else if (isClient) strokeColor = "stroke-slate-600";
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  {/* Cuerpo de la clase */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="6"
                    className={`fill-slate-900/90 ${strokeColor}`}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? "drop-shadow(0 0 8px rgba(99,102,241,0.35))" : ""}
                  />

                  {/* Cabecera / Estereotipo */}
                  <rect
                    x={node.x + 1}
                    y={node.y + 1}
                    width={node.width - 2}
                    height={32}
                    rx="5"
                    className={isSelected ? "fill-indigo-950/70" : "fill-slate-800/80"}
                  />
                  
                  {/* Etiqueta tipo de clase */}
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + 14}
                    textAnchor="middle"
                    className="text-[9px] font-bold tracking-wider fill-slate-400 uppercase"
                  >
                    {isInterface ? "«interface»" : isAbstract ? "«abstract class»" : isClient ? "«client entry»" : "«concrete class»"}
                  </text>
                  
                  {/* Nombre de la clase */}
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + 26}
                    textAnchor="middle"
                    className={`text-xs font-bold ${isSelected ? "fill-indigo-300" : "fill-slate-200"}`}
                  >
                    {node.name.split(" (")[0]}
                  </text>

                  {/* Atributos */}
                  {node.attributes.length > 0 ? (
                    <text x={node.x + 12} y={node.y + 52} className="text-[10px] font-mono fill-slate-300">
                      - {node.attributes[0]}
                    </text>
                  ) : (
                    <text x={node.x + 12} y={node.y + 52} className="text-[10px] italic fill-slate-500">
                      Ningún atributo
                    </text>
                  )}

                  {/* Línea divisoria atributos/métodos */}
                  <line
                    x1={node.x}
                    y1={node.y + 64}
                    x2={node.x + node.width}
                    y2={node.y + 64}
                    stroke={isSelected ? "#6366f1" : "#334155"}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                  />

                  {/* Métodos */}
                  {node.methods.map((method, idx) => (
                    <text
                      key={method}
                      x={node.x + 12}
                      y={node.y + 82 + idx * 16}
                      className="text-[10px] font-mono fill-slate-300"
                    >
                      + {method}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Columna Derecha: Inspector Académico y código */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h5 className="font-bold text-slate-100">{selectedNode.name}</h5>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-slate-850 rounded font-semibold text-slate-400 uppercase tracking-widest border border-slate-700">
                {selectedNode.type}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            {/* Responsabilidades Académicas (Muy alineado a la rúbrica) */}
            <div className="mb-4">
              <h6 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Responsabilidades
              </h6>
              <ul className="space-y-1.5">
                {selectedNode.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Atributos y Métodos */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3 mb-4">
              <div>
                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campos / Atributos</h6>
                {selectedNode.attributes.length > 0 ? (
                  nodeList(selectedNode.attributes)
                ) : (
                  <span className="text-xs text-slate-500 italic">Sifón de estado (ninguno)</span>
                )}
              </div>
              <div>
                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Métodos</h6>
                {nodeList(selectedNode.methods)}
              </div>
            </div>
          </div>

          {/* Código de Ilustración de este Espectro */}
          <div className="mt-auto border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Code className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Código de la Clase</span>
              </div>
              <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                <button
                  onClick={() => setLang("java")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition cursor-pointer ${lang === "java" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Java (Recomendado)
                </button>
                <button
                  onClick={() => setLang("ts")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition cursor-pointer ${lang === "ts" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  TypeScript
                </button>
              </div>
            </div>

            <pre className="text-[11px] font-mono bg-slate-900 p-3 rounded border border-slate-800 max-h-[140px] overflow-y-auto text-slate-300">
              <code>{lang === "java" ? selectedNode.codeJava : selectedNode.codeTS}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function nodeList(list: string[]) {
  return (
    <div className="flex flex-col gap-1">
      {list.map(f => (
        <code key={f} className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-indigo-300 font-mono w-max max-w-full truncate">
          {f}
        </code>
      ))}
    </div>
  );
}
