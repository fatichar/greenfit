export function trackEvent(eventName: string, eventData?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.umami && typeof window.umami.track === "function") {
    if (eventData) {
      window.umami.track(eventName, eventData);
    } else {
      window.umami.track(eventName);
    }
  }
}

// Ensure TypeScript knows about window.umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number>) => void;
    };
  }
}
