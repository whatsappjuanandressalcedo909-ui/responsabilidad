import { useState } from "react";
import { Folder, FileCode, Check, Copy, Code, AlertTriangle, Sparkles } from "lucide-react";

interface CodeFile {
  name: string;
  lang: "java" | "ts";
  role: "Interface" | "Abstract" | "Manejador" | "Dato" | "Client";
  content: string;
  explanation: string;
}

export default function CodeViewer() {
  const [activeLang, setActiveLang] = useState<"java" | "ts">("java");
  const [activeFileIdx, setActiveFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const javaFiles: CodeFile[] = [
    {
      name: "Handler.java",
      lang: "java",
      role: "Interface",
      explanation: "Declara el contrato base que todos los manejadores concretos deben cumplir. Permite el polimorfismo en la cadena.",
      content: `package upc.patrones.cor;

/**
 * Interfaz Manejadora Base
 * Define el contrato estándar para configurar el sucesor y procesar peticiones.
 */
public interface Handler {
    // Establece el siguiente manejador en la secuencia y retorna su referencia
    // (para permitir inicialización fluida h1.setNext(h2).setNext(h3))
    Handler setNext(Handler next);
    
    // Procesa el ticket o lo deriva al siguiente sucesor en la cadena
    void handle(Request request);
}`
    },
    {
      name: "BaseHandler.java",
      lang: "java",
      role: "Abstract",
      explanation: "Proporciona la infraestructura común del patrón: almacena la referencia del suiguiente eslabón y define la propagación por defecto.",
      content: `package upc.patrones.cor;

/**
 * Clase Abstracta de Soporte
 * Implementa el almacenamiento del sucesor y la delegación predeterminada.
 */
public abstract class BaseHandler implements Handler {
    // Referencia al siguiente eslabón (Encadenamiento por composición)
    protected Handler nextHandler;

    @Override
    public Handler setNext(Handler next) {
        this.nextHandler = next;
        return next; // Retorna el parámetro especificado para permitir encadenamiento en serie
    }

    @Override
    public void handle(Request request) {
        // Fallback por defecto: si este eslabón no procesa, derivamos automáticamente al siguiente
        if (this.nextHandler != null) {
            this.nextHandler.handle(request);
        } else {
            System.out.println("⚠️ [Fin de Cadena] Ningún nivel pudo resolver el incidente.");
        }
    }
}`
    },
    {
      name: "SoporteNivel1.java",
      lang: "java",
      role: "Manejador",
      explanation: "Manejador Concreto. Resuelve incidentes 'Bajo'. Si no puede, delega pasivamente invocando a super.handle().",
      content: `package upc.patrones.cor;

/**
 * Especialización: Técnico Junior (Nivel 1)
 * Responsable exclusivo de incidencias de dificultad "Baja"
 */
public class SoporteNivel1 extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (request.getDificultad().equalsIgnoreCase("Bajo")) {
            System.out.println("✅ [Nvl 1 (Junior)] Incidente '" + request.getDescripcion() + "' RESUELTO satisfactoriamente.");
        } else {
            // No podemos procesarlo, derivamos polimórficamente al sucesor definido
            System.out.println("❌ [Nvl 1 (Junior)] Incidente de nivel superior. Derivando...");
            super.handle(request);
        }
    }
}`
    },
    {
      name: "SoporteNivel2.java",
      lang: "java",
      role: "Manejador",
      explanation: "Manejador Concreto. Resuelve incidentes 'Medio'. No tiene que conocer a SoporteNivel1, desacoplando los niveles.",
      content: `package upc.patrones.cor;

/**
 * Especialización: Especialista de Infraestructura (Nivel 2)
 * Responsable de incidencias de dificultad "Media"
 */
public class SoporteNivel2 extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (request.getDificultad().equalsIgnoreCase("Medio")) {
            System.out.println("✅ [Nvl 2 (Senior)] Incidente '" + request.getDescripcion() + "' RESUELTO configurando VPN/Base de Datos.");
        } else {
            System.out.println("❌ [Nvl 2 (Senior)] Dificultad escapa a mis conocimientos. Derivando...");
            super.handle(request);
        }
    }
}`
    },
    {
      name: "Request.java",
      lang: "java",
      role: "Dato",
      explanation: "Clase que encapsula los datos del problema o petición enviado por la cadena. Evita acoplar parámetros sueltos.",
      content: `package upc.patrones.cor;

/**
 * Petición de Incidencia
 * Contiene los datos que circularán por la cadena.
 */
public class Request {
    private String dificultad; // "Bajo", "Medio", "Alto", "Crítico"
    private String descripcion;

    public Request(String dificultad, String descripcion) {
        this.dificultad = dificultad;
        this.descripcion = descripcion;
    }

    public String getDificultad() {
        return dificultad;
    }

    public String getDescripcion() {
        return descripcion;
    }
}`
    },
    {
      name: "MainApp.java",
      lang: "java",
      role: "Client",
      explanation: "Punto de entrada. Aquí se configuran los eslabones, se encadenan usando setNext(), y se lanzan los eventos.",
      content: `package upc.patrones.cor;

/**
 * Cliente Principal del Sistema
 * Ensambla la cadena dinámicamente y lanza las solicitudes.
 */
public class MainApp {
    public static void main(String[] args) {
        // 1. Instanciar los manejadores concretos de soporte
        Handler nivel1 = new SoporteNivel1();
        Handler nivel2 = new SoporteNivel2();
        
        // El nivel 3 procesa el resto (no tiene sucesor directo en este ejemplo básico)
        Handler nivel3 = new BaseHandler() {
            @Override
            public void handle(Request request) {
                if (request.getDificultad().equalsIgnoreCase("Alto")) {
                    System.out.println("✅ [Nvl 3 (Devs)] Error en código solucionado para: " + request.getDescripcion());
                } else {
                    super.handle(request); // Final de la secuencia
                }
            }
        };

        // 2. Configurar la cadena (El acoplamiento se ubica sólo aquí!)
        nivel1.setNext(nivel2).setNext(nivel3);

        // 3. Crear casos de prueba
        Request r1 = new Request("Bajo", "Fallo al conectar ratón USB");
        Request r2 = new Request("Medio", "Clave Oracle bloqueada por ORA-01017");
        Request r3 = new Request("Alto", "Microservicio en AWS no responde puerto 443");
        Request r4 = new Request("Crítico", "Ataque DDoS saturando el firewall corporativo");

        // 4. Procesar en cadena siempre llamando al primer elemento (nivel1)
        System.out.println("--- ENVIANDO TICKET 1 ---");
        nivel1.handle(r1);

        System.out.println("\\n--- ENVIANDO TICKET 2 ---");
        nivel1.handle(r2);

        System.out.println("\\n--- ENVIANDO TICKET 3 ---");
        nivel1.handle(r3);

        System.out.println("\\n--- ENVIANDO TICKET 4 ---");
        nivel1.handle(r4);
    }
}`
    }
  ];

  const tsFiles: CodeFile[] = [
    {
      name: "handler.ts",
      lang: "ts",
      role: "Interface",
      explanation: "Mismas responsabilidades en JavaScript/TypeScript, estructurado mediante interfaces para tipado seguro.",
      content: `export interface Request {
  dificultad: "Bajo" | "Medio" | "Alto" | "Crítico";
  descripcion: string;
}

export interface Handler {
  setNext(next: Handler): Handler;
  handle(request: Request): void;
}`
    },
    {
      name: "base-handler.ts",
      lang: "ts",
      role: "Abstract",
      explanation: "Clase abstracta de TypeScript que sirve como implementación genérica del contrato de encadenamiento.",
      content: `import { Handler, Request } from "./handler";

export abstract class BaseHandler implements Handler {
  protected next: Handler | null = null;

  public setNext(next: Handler): Handler {
    this.next = next;
    // Retorna next para encadenamiento fluido (builder style)
    return next;
  }

  public handle(request: Request): void {
    if (this.next) {
      this.next.handle(request);
    } else {
      console.log("⚠️ [Fin de la Cadena] Ningún manejador calificado.");
    }
  }
}`
    },
    {
      name: "soporte-n1.ts",
      lang: "ts",
      role: "Manejador",
      explanation: "Clase que de forma concreta se enfoca exclusivamente en tickets leves, heredando la delegación por defecto.",
      content: `import { BaseHandler } from "./base-handler";
import { Request } from "./handler";

export class SoporteNivel1 extends BaseHandler {
  public handle(request: Request): void {
    if (request.dificultad === "Bajo") {
      console.log(\`✅ [Nivel 1] Resuelto: \${request.descripcion}\`);
    } else {
      console.log("[Nivel 1] Incidente complejo. Transfiriendo...");
      super.handle(request); // Invoca paso automático en superclase
    }
  }
}`
    },
    {
      name: "soporte-n2.ts",
      lang: "ts",
      role: "Manejador",
      explanation: "Manejador para tickets intermedios. Extiende BaseHandler e intercepta la ejecución.",
      content: `import { BaseHandler } from "./base-handler";
import { Request } from "./handler";

export class SoporteNivel2 extends BaseHandler {
  public handle(request: Request): void {
    if (request.dificultad === "Medio") {
      console.log(\`✅ [Nivel 2 (Soporte TI)] Incidente Resuelto: \${request.descripcion}\`);
    } else {
      console.log("[Nivel 2 (Soporte TI)] Requiere DevOps o C-level. Derivando...");
      super.handle(request);
    }
  }
}`
    }
  ];

  const currentFiles = activeLang === "java" ? javaFiles : tsFiles;
  const safeFileIdx = activeFileIdx >= currentFiles.length ? 0 : activeFileIdx;
  const activeFile = currentFiles[safeFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="visor-codigo" className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-teal-400 mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400"></span> Código de Ejemplo Implementado
          </h4>
          <p className="text-xs text-slate-400">
            Explora las clases separadas y listas para compilar. El código posee comentarios académicos y nombres autodescriptivos como exige la rúbrica.
          </p>
        </div>

        {/* Selector de Lenguaje */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setActiveLang("java");
              setActiveFileIdx(0);
            }}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeLang === "java" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Java (Rubrica Recomendado)
          </button>
          <button
            onClick={() => {
              setActiveLang("ts");
              setActiveFileIdx(0);
            }}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeLang === "ts" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            TypeScript
          </button>
        </div>
      </div>

      {/* Editor simulado */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Explorador de archivos (Lateral) */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5 text-yellow-500" /> upc.patrones.cor
          </span>

          <div className="flex flex-col gap-1">
            {currentFiles.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFileIdx(idx)}
                className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                  idx === safeFileIdx ? "bg-slate-808/80 text-indigo-400 border-l-2 border-indigo-505" : "text-slate-400 hover:bg-slate-900 hover:text-slate-250"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className={`h-4 w-4 ${idx === safeFileIdx ? "text-indigo-400" : "text-slate-400"}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[8px] bg-slate-900 text-slate-500 border border-slate-850 px-1 py-0.2 rounded uppercase font-semibold">
                  {file.role}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-930 pt-3 flex flex-col gap-2">
            <div className="bg-amber-500/5 p-2 rounded border border-amber-500/10 flex items-start gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-300 leading-relaxed font-sans">
                <span className="font-bold text-slate-200">Estructura Desacoplada:</span> Los manejadores concretos no se conocen entre sí.
                Solo dependen de la abstracción <code className="bg-slate-905 border px-1 border-slate-800 py-0.2">Handler</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Visualización del código */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-slate-950 rounded-lg border border-slate-800">
          {/* Cabecera del archivo en el editor */}
          <div className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded-t-lg border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-slate-200">{activeFile.name}</span>
            </div>

            <button
              onClick={handleCopy}
              className="text-[10px] text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 py-1 px-2.5 rounded hover:bg-slate-850 transition flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar Código
                </>
              )}
            </button>
          </div>

          {/* Explicación y Código */}
          <div className="p-4 flex flex-col gap-3 font-sans">
            <div className="bg-slate-905 p-2.5 rounded border-l-2 border-indigo-500 text-xs text-slate-300 border border-slate-800">
              <span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] block mb-1">Análisis Académico</span>
              {activeFile.explanation}
            </div>

            <pre className="text-[11px] font-mono p-4 rounded bg-slate-900 overflow-x-auto text-slate-200 border border-slate-900/60 max-h-[340px] leading-relaxed">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Contraste: Antipatrón (Problema) vs. Chain of Responsibility (Solución) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h5 className="text-[10px] uppercase font-bold text-rose-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Comparativa y Beneficio: ¿Por qué aplicar este patrón?
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Problema (Antipatrón - IF/ELSE Hell) */}
          <div className="bg-rose-950/10 p-3.5 rounded-lg border border-rose-900/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                ❌ Código Sin Patrón (Uso Extremo de Condicionales)
              </span>
              <span className="text-[9px] font-mono text-rose-500 uppercase font-bold">Problema</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Sin la Cadena de Responsabilidad, el emisor coordina todo el ruteo mediante bloques masivos de <code>if-else</code>. Si agregamos un nuevo nivel de soporte, violamos el principio Abierto/Cerrado (OCP).
            </p>
            <pre className="text-[10px] font-mono bg-slate-900 p-2.5 rounded text-rose-300 max-h-[140px] overflow-y-auto">
{`// Acoplamiento severo y monolítico
public class SoporteCliente {
    public void despacharIncidente(Request request) {
        if (request.getDificultad().equals("Bajo")) {
            // Resolver aquí en línea...
        } else if (request.getDificultad().equals("Medio")) {
            // Instanciar experto, configurar accesos...
        } else if (request.getDificultad().equals("Alto")) {
            // Notificar equipo DevOps...
        } else if (request.getDificultad().equals("Crítico")) {
            // Enviar alerta SMS a Directores...
        } else {
            throw new Exception("Incompatible");
        }
    }
}`}
            </pre>
          </div>

          {/* Solución (Con Patrón) */}
          <div className="bg-emerald-950/10 p-3.5 rounded-lg border border-emerald-900/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                ✅ Con Patrón Cadena de Responsabilidad
              </span>
              <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold">Solución</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              El cliente solo conoce la interfaz abstracta del primer manejador. Añadir nuevos eslabones o reordenar la cadena se hace reensamblando en un solo punto, sin tocar las clases existentes de soporte.
            </p>
            <pre className="text-[10px] font-mono bg-slate-900 p-2.5 rounded text-emerald-300 max-h-[140px] overflow-y-auto">
{`// Código limpio, modular y extensible
public class ClienteLimpio {
    public void procesarSeguro(Handler soporteInicial, Request req) {
        // Al cliente no le importa cuántos niveles hay,
        // ni quién es el especialista correcto ni su lógica interna:
        soporteInicial.handle(req);
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
