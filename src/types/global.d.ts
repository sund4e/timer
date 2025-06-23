// This declaration file extends the global Window interface to include the umami object.
// This makes TypeScript aware of the umami analytics library, preventing type errors.
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

// An empty export is required to treat this file as a module and apply the global declaration.
export {};
