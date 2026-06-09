// lib/debug.ts
export const debug = {
  log: (context: string, data: any) => {
    console.log(`[${new Date().toISOString()}] [${context}]`, data);
  },
  error: (context: string, error: any) => {
    console.error(`[${new Date().toISOString()}] [${context}] ERROR:`, error);
  },
  table: (context: string, data: any) => {
    console.group(`[${context}]`);
    console.table(data);
    console.groupEnd();
  }
};