import { ReactNode } from "react";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  category: "introduccion" | "teoria" | "diagramas" | "simulacion" | "codigo" | "evaluacion" | "conclusiones";
  content: ReactNode;
}

export interface SimulationRequest {
  id: string;
  title: string;
  difficulty: "Bajo" | "Medio" | "Alto" | "Crítico";
  description: string;
  status: "idle" | "evaluating" | "handled" | "unhandled";
  currentHandlerId?: string;
  handledBy?: string;
  history: Array<{ handlerId: string; action: "check" | "handle" | "forward"; message: string }>;
}

export interface HandlerNode {
  id: string;
  name: string;
  title: string;
  level: "Junior" | "Senior" | "Soporte Especializado" | "Manager";
  canHandleRegex: string;
  description: string;
  capabilities: string[];
}

export interface EvaluationResult {
  approved: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}
