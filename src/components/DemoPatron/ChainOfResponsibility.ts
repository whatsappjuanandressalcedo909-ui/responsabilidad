/**
 * Representa la solicitud (Request) que pasará a través de la Cadena de Responsabilidad.
 */
export interface MessageRequest {
  text: string;
  originalText: string;
  status: "success" | "warning" | "rejected";
  priority: "Baja" | "Media" | "Alta" | "Crítica";
  logs: string[];
  metadata: {
    scriptsDetected: boolean;
    piiMasked: boolean;
    hasProfanity: boolean;
    charCount: number;
    wordCount: number;
  };
}

/**
 * Interfaz Handler que define el contrato obligatorio para cada eslabón de la cadena.
 */
export interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: MessageRequest): MessageRequest;
}

/**
 * Clase BaseHandler que implementa el comportamiento por defecto de la cadena de llamadas recursivas.
 * Permite que los manejadores concretos solo se enfoquen en su responsabilidad única (SRP).
 */
export abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;

  /**
   * Vincula el siguiente manejador en la secuencia.
   * Criterio Académico: Retornar el manejador pasado permite el encadenamiento fluido (fluent interface).
   */
  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  /**
   * Comportamiento estándar: si hay un siguiente eslabón, delega la ejecución; si no, finaliza de manera segura.
   */
  public handle(request: MessageRequest): MessageRequest {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    request.logs.push("⚙️ [Fin de Cadena] Mensaje procesado exitosamente por todos los eslabones activos.");
    return request;
  }
}

/**
 * Eslabón 1: Validador de Tamaño y Sintaxis básica.
 * Verifica que el mensaje no esté vacío o sea excesivamente largo.
 */
export class SizeValidationHandler extends BaseHandler {
  public override handle(request: MessageRequest): MessageRequest {
    const len = request.text.trim().length;
    request.metadata.charCount = len;
    request.metadata.wordCount = request.text.trim() === "" ? 0 : request.text.trim().split(/\s+/).length;

    if (len === 0) {
      request.status = "rejected";
      request.logs.push("❌ [Detector de Tamaño] Rechazado: El mensaje está completamente vacío.");
      return request; // Detiene la cadena de inmediato
    }

    if (len > 300) {
      request.status = "warning";
      request.logs.push("⚠️ [Detector de Tamaño] Advertencia: Longitud de caracteres superior a 300. Se requiere revisión manual.");
    } else {
      request.logs.push("✓ [Detector de Tamaño] Aprobado: Tamaño del payload dentro de los rangos óptimos.");
    }

    return super.handle(request);
  }
}

/**
 * Eslabón 2: Sanitizador de Scripts y Código Malicioso.
 * Busca patrones HTML, `<script>`, o inyecciones SQL sospechosas para eliminarlas.
 */
export class SecuritySanitizationHandler extends BaseHandler {
  public override handle(request: MessageRequest): MessageRequest {
    const rxScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const rxHTML = /<\/?[^>]+(>|$)/g;

    let modifiedText = request.text;
    let detected = false;

    if (rxScript.test(modifiedText)) {
      detected = true;
      modifiedText = modifiedText.replace(rxScript, "[REMOVED_SCRIPT]");
    }
    
    if (rxHTML.test(modifiedText)) {
      detected = true;
      modifiedText = modifiedText.replace(rxHTML, " ");
    }

    // Detectar inyecciones SQL comunes
    const rxSQL = /\b(UNION SELECT|DROP DATABASE|DROP TABLE|OR 1=1)\b/gi;
    if (rxSQL.test(modifiedText)) {
      detected = true;
      modifiedText = modifiedText.replace(rxSQL, "[BLOQUEADO_SQL]");
      request.status = "warning";
      request.logs.push("⚠️ [Sanitizador de Seguridad] Detectado intento de Inyección SQL. Bloqueando comando.");
    }

    if (detected) {
      request.text = modifiedText;
      request.metadata.scriptsDetected = true;
      request.logs.push("🛡️ [Sanitizador de Seguridad] Sanitización ejecutada: Removidos scripts HTML y etiquetas inseguras.");
    } else {
      request.logs.push("✓ [Sanitizador de Seguridad] Limpio: No se encontraron patrones de código inyectables.");
    }

    return super.handle(request);
  }
}

/**
 * Eslabón 3: Enmascarador de Datos Sensibles (PII - Personally Identifiable Information).
 * Reemplaza correos y números de tarjetas con asteriscos para cumplir con normas de privacidad (GDPR).
 */
export class PIIMaskHandler extends BaseHandler {
  public override handle(request: MessageRequest): MessageRequest {
    // Regex de correo electrónico básico
    const rxEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    // Regex para tarjetas de crédito comunes (16 dígitos continuos o separados por guiones o espacios)
    const rxCard = /\b(?:\d[ -]*?){13,16}\b/g;

    let modifiedText = request.text;
    let masked = false;

    if (rxEmail.test(modifiedText)) {
      masked = true;
      modifiedText = modifiedText.replace(rxEmail, (match) => {
        const [user, domain] = match.split("@");
        const maskedUser = user.substring(0, Math.min(2, user.length)) + "***";
        return `${maskedUser}@${domain}`;
      });
    }

    if (rxCard.test(modifiedText)) {
      masked = true;
      modifiedText = modifiedText.replace(rxCard, (match) => {
        const numbersOnly = match.replace(/[-\s]/g, "");
        if (numbersOnly.length >= 13 && numbersOnly.length <= 16) {
          const lastFour = numbersOnly.slice(-4);
          return `XXXX-XXXX-XXXX-${lastFour}`;
        }
        return match;
      });
    }

    if (masked) {
      request.text = modifiedText;
      request.metadata.piiMasked = true;
      request.logs.push("📧 [Máscara PII] Enmascaramiento activo: Protegidas las credenciales y datos financieros del usuario.");
    } else {
      request.logs.push("✓ [Máscara PII] Conforme: No se detectaron correos ni números de tarjetas expuestos.");
    }

    return super.handle(request);
  }
}

/**
 * Eslabón 4: Filtro de Palabras Ofensivas y Reglas de Cortesía (Censura Académica).
 * Suaviza términos inadecuados de forma constructiva.
 */
export class ProfanityFilterHandler extends BaseHandler {
  private static FORBIDDEN_WORDS = [
    { regex: /\b(idiota|inutil|inservible|estupido|basura|porqueria)\b/gi, replacement: "🤬 [Censurado]" },
    { regex: /\b(falla|roto|defecto|malo)\b/gi, replacement: "⚠️ anomalía" }
  ];

  public override handle(request: MessageRequest): MessageRequest {
    let modifiedText = request.text;
    let profanityFound = false;

    for (const item of ProfanityFilterHandler.FORBIDDEN_WORDS) {
      if (item.regex.test(modifiedText)) {
        profanityFound = true;
        modifiedText = modifiedText.replace(item.regex, item.replacement);
      }
    }

    if (profanityFound) {
      request.text = modifiedText;
      request.metadata.hasProfanity = true;
      request.logs.push("🤐 [Filtro de Cortesía] Reemplazo de palabras: Suavizadas expresiones agresivas o negativas.");
    } else {
      request.logs.push("✓ [Filtro de Cortesía] Cordial: Mensaje redactado con lenguaje académico óptimo.");
    }

    return super.handle(request);
  }
}

/**
 * Eslabón 5: Detector Inteligente de Prioridades.
 * Asigna la prioridad según palabras clave en el contenido definitivo.
 */
export class PriorityDetectorHandler extends BaseHandler {
  public override handle(request: MessageRequest): MessageRequest {
    const rxCritical = /\b(urgente|colapso|estafa|fraude|caida|robado|critico|bloqueado)\b/gi;
    const rxHigh = /\b(ayuda|soporte|reclamo|error|problema|tarifa|demora)\b/gi;

    if (rxCritical.test(request.text)) {
      request.priority = "Crítica";
      request.logs.push("⚡ [Detector de Prioridad] Flujo crítico: Enrutando con alta urgencia debido a palabras clave críticas.");
    } else if (rxHigh.test(request.text)) {
      request.priority = "Alta";
      request.logs.push("📈 [Detector de Prioridad] Flujo alto: Prioridad escalada para soporte prioritario.");
    } else {
      request.priority = "Media";
      request.logs.push("✓ [Detector de Prioridad] Regulado: Prioridad estándar. Ruteo a cola de atención general.");
    }

    return super.handle(request);
  }
}
