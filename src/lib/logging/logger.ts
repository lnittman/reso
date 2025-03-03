/**
 * Structured Logging System for reso
 * 
 * This module provides standardized logging utilities with tagged prefixes
 * for consistent logging across the application, especially for tracking
 * LLM interactions and API requests.
 */

// Types of log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log service areas for tagging
export type LogArea = 
  // API endpoints
  | 'api:playlists'
  | 'api:recommendations' 
  | 'api:users'
  | 'api:auth'
  | 'api:music'
  
  // LLM interactions
  | 'llm:prompt'
  | 'llm:response'
  | 'llm:error'
  
  // Data services
  | 'data:perplexity'
  | 'data:jina'
  | 'data:prisma'
  
  // External integrations
  | 'ext:spotify'
  | 'ext:apple'
  | 'ext:youtube'
  
  // General app areas
  | 'app:startup'
  | 'app:auth'
  | 'app:ui';

// Base logging interface
interface LogOptions {
  // Additional metadata for structured logging
  meta?: Record<string, any>;
  // Whether to persist this log for analysis (default: false)
  persist?: boolean;
  // Log level
  level?: LogLevel;
}

// Special options for LLM interactions
interface LLMLogOptions extends LogOptions {
  // ID to track conversation context
  conversationId?: string;
  // Input prompt or completion tokens
  tokenCount?: number;
  // Type of LLM model used
  modelName?: string;
  // Latency in milliseconds
  latencyMs?: number;
}

/**
 * Creates a formatted log prefix for consistent logging
 * @param area The functional area of the application
 * @returns A formatted prefix string
 */
function formatPrefix(area: LogArea): string {
  return `[${area}]`;
}

/**
 * Core logging function with structured metadata
 */
function logWithMeta(
  area: LogArea,
  message: string,
  options: LogOptions = {}
): void {
  const { meta = {}, level = 'info', persist = false } = options;
  const prefix = formatPrefix(area);
  const timestamp = new Date().toISOString();
  
  // Prepare structured log data
  const logData = {
    timestamp,
    area,
    message,
    level,
    ...meta
  };
  
  // Console output formatting
  if (level === 'error') {
    console.error(`${prefix} ${timestamp} - ${message}`, meta);
  } else if (level === 'warn') {
    console.warn(`${prefix} ${timestamp} - ${message}`, meta);
  } else if (level === 'debug') {
    console.debug(`${prefix} ${timestamp} - ${message}`, meta);
  } else {
    console.log(`${prefix} ${timestamp} - ${message}`, meta);
  }
  
  // In a production environment, we would persist logs to a service
  // if the persist flag is set to true
  if (persist && process.env.NODE_ENV === 'production') {
    // This would integrate with a logging service like Datadog, CloudWatch, etc.
    // logService.send(logData);
  }
}

/**
 * Log detailed LLM interactions with standardized format
 */
export function logLLMInteraction(
  type: 'prompt' | 'response' | 'error',
  message: string,
  data: any,
  options: LLMLogOptions = {}
): void {
  const area = `llm:${type}` as LogArea;
  const { conversationId, tokenCount, modelName, latencyMs, ...rest } = options;
  
  // Always persist LLM interactions by default for analysis
  const persist = options.persist ?? true;
  
  // Enhanced metadata specific to LLM interactions
  const meta = {
    ...rest.meta,
    conversationId,
    tokenCount,
    modelName,
    latencyMs,
    data: process.env.NODE_ENV === 'development' ? data : undefined
  };
  
  logWithMeta(area, message, { 
    ...rest, 
    meta, 
    persist 
  });
  
  // In development, show more verbose information about the LLM interaction
  if (process.env.NODE_ENV === 'development') {
    if (type === 'prompt') {
      console.group(`${formatPrefix(area)} Full Prompt`);
      console.dir(data, { depth: null, colors: true });
      console.groupEnd();
    } else if (type === 'response') {
      console.group(`${formatPrefix(area)} Full Response`);
      console.dir(data, { depth: null, colors: true });
      console.groupEnd();
    }
  }
}

/**
 * Log API requests with standardized format
 */
export function logAPI(
  endpoint: string,
  method: string,
  message: string,
  options: LogOptions = {}
): void {
  // Determine the API area based on the endpoint
  let area: LogArea = 'api:playlists';
  
  if (endpoint.includes('playlists')) {
    area = 'api:playlists';
  } else if (endpoint.includes('recommendations')) {
    area = 'api:recommendations';
  } else if (endpoint.includes('users')) {
    area = 'api:users';
  } else if (endpoint.includes('auth')) {
    area = 'api:auth';
  } else if (endpoint.includes('music')) {
    area = 'api:music';
  }
  
  // Enhanced metadata for API requests
  const meta = {
    ...options.meta,
    endpoint,
    method,
    requestId: crypto.randomUUID()
  };
  
  logWithMeta(area, message, { ...options, meta });
}

/**
 * Log external service interactions
 */
export function logExternal(
  service: 'spotify' | 'apple' | 'youtube' | 'perplexity' | 'jina',
  operation: string,
  message: string,
  options: LogOptions = {}
): void {
  const area = service === 'perplexity' || service === 'jina' 
    ? `data:${service}` as LogArea
    : `ext:${service}` as LogArea;
  
  const meta = {
    ...options.meta,
    operation
  };
  
  logWithMeta(area, message, { ...options, meta });
}

/**
 * Log application events
 */
export function logApp(
  area: 'startup' | 'auth' | 'ui',
  message: string,
  options: LogOptions = {}
): void {
  logWithMeta(`app:${area}` as LogArea, message, options);
}

// Default logger export with all methods
export const logger = {
  api: logAPI,
  llm: logLLMInteraction,
  external: logExternal,
  app: logApp,
  
  // Basic log levels
  debug: (area: LogArea, message: string, meta?: Record<string, any>) => 
    logWithMeta(area, message, { level: 'debug', meta }),
  
  info: (area: LogArea, message: string, meta?: Record<string, any>) => 
    logWithMeta(area, message, { level: 'info', meta }),
  
  warn: (area: LogArea, message: string, meta?: Record<string, any>) => 
    logWithMeta(area, message, { level: 'warn', meta }),
  
  error: (area: LogArea, message: string, meta?: Record<string, any>) => 
    logWithMeta(area, message, { level: 'error', meta, persist: true })
}; 