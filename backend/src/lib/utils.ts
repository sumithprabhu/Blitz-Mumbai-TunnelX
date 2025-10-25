// src/lib/utils.ts

/**
 * Validate Ethereum address (0x-prefixed, 40 hex chars)
 */
export function isAddress(addr?: string): boolean {
    return !!addr && /^0x[a-fA-F0-9]{40}$/.test(addr);
  }
  
  /**
   * Ensure a non-empty string
   */
  export function nonEmpty(value?: string): boolean {
    return !!value && value.trim().length > 0;
  }
  
  /**
   * Check if value is a positive number
   */
  export function isPositiveNumber(value?: number): boolean {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }
  
  /**
   * Simplify JSON response creation
   */
  export function jsonResponse(
    data: any,
    status: number = 200
  ): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  /**
   * Convert MB → GB (1 GB = 1024 MB)
   */
  export function mbToGb(mb: number): number {
    return mb / 1024;
  }
  
  /**
   * Generate a short random ID (for temporary entries or logs)
   */
  export function shortId(prefix: string = ""): string {
    const rand = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}-${rand}` : rand;
  }
  