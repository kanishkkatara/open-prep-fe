export {};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;

    // Optional Razorpay typings if you want to avoid `any`
    Razorpay?: new (options: any) => {
      open(): void;
      on(event: string, handler: (response: any) => void): void;
    };
  }
}
