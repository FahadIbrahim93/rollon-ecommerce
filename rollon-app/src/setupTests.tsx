import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver for Radix UI components
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock PointerEvent for Radix UI components like Sheet/Dialog
if (!window.PointerEvent) {
  // @ts-expect-error - Mocking PointerEvent
  window.PointerEvent = class PointerEvent extends MouseEvent {};
}

// Mock other browser APIs not available in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

// Mock Radix UI Portal and Dialog to render children inline for easier testing
vi.mock('@radix-ui/react-portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
  Root: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open }: any) => (open ? children : null),
  Trigger: ({ children }: any) => children,
  Portal: ({ children }: any) => children,
  Overlay: () => null,
  Content: ({ children }: any) => <div>{children}</div>,
  Close: ({ children }: any) => <button>{children}</button>,
  Title: ({ children }: any) => <h2>{children}</h2>,
  Description: ({ children }: any) => <p>{children}</p>,
}));

// Mock Framer Motion to skip animations in tests
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
      h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
      h4: ({ children, ...props }: any) => <h4 {...props}>{children}</h4>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
      main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});
