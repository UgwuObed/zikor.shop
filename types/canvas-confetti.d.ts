declare module 'canvas-confetti' {
    interface ConfettiOptions {
      particleCount?: number;
      angle?: number;
      spread?: number;
      startVelocity?: number;
      decay?: number;
      gravity?: number;
      drift?: number;
      ticks?: number;
      origin?: { x: number; y: number };
      colors?: string[];
      shapes?: ('square' | 'circle')[];
      scalar?: number;
      zIndex?: number;
      disableForReducedMotion?: boolean;
    }
  
    function confetti(options?: ConfettiOptions): Promise<void>;
    function confetti(
      options?: ConfettiOptions & { reset?: boolean }
    ): Promise<void>;
    function confetti(
      options?: ConfettiOptions & { particleCount: number }
    ): Promise<void>;
  
    export = confetti;
  }