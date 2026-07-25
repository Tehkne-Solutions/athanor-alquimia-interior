declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any }
  interface IntrinsicAttributes { key?: any }
}
interface ImportMeta { env: { DEV: boolean } }
declare module 'react' {
  export type ReactNode = any;
  export type PropsWithChildren<T = unknown> = T & { children?: ReactNode };
  export type ButtonHTMLAttributes<T> = Record<string, any>;
  export function StrictMode(props: any): any;
  export function useState<T>(initial: T): [T, (value: T | ((previous: T) => T)) => void];
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
}
declare module 'react/jsx-runtime' { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module 'react-dom/client' { export function createRoot(element: Element): { render(node: any): void }; }
declare module 'react-router-dom' {
  export const BrowserRouter: any; export const Routes: any; export const Route: any; export const Navigate: any;
  export const NavLink: any; export const Outlet: any;
  export function useNavigate(): (to: string) => void;
}
declare module 'lucide-react' {
  export const ArrowRight:any; export const BookOpenText:any; export const ShieldCheck:any; export const Sparkles:any;
  export const CheckCircle2:any; export const Palette:any; export const UserRound:any; export const BookOpen:any; export const Gem:any; export const Sprout:any;
  export const BookHeart:any; export const BookOpenCheck:any; export const Gamepad2:any; export const Landmark:any; export const PenTool:any;
  export const Database:any; export const LampDesk:any; export const Wind:any; export const BookMarked:any; export const MessageCircleQuestion:any; export const PauseCircle:any;
  export const CircleHelp:any; export const Layers3:any; export const Check:any; export const Hammer:any; export const MapPin:any; export const Archive:any;
  export const GitBranch:any; export const Library:any; export const ScrollText:any; export const Award:any; export const Compass:any; export const Shield:any;
  export const RotateCcw:any; export const TestTube2:any; export const HeartHandshake:any; export const Phone:any; export const ShieldAlert:any;
  export const Boxes:any; export const Map:any; export const Flame:any; export const Flower2:any; export const LibraryBig:any; export const TreePine:any;
}
declare module 'zustand' { export function create<T>(): any; }
declare module 'zustand/middleware' {
  export type StateStorage = any;
  export function persist(...args: any[]): any;
  export function createJSONStorage(...args: any[]): any;
}
declare module 'zod' { export const z: any; }
declare module '@vitejs/plugin-react' { const plugin: any; export default plugin; }
declare module 'vitest/config' { export function defineConfig(config: any): any; }
declare module 'vitest' { export const describe: any; export const expect: any; export const it: any; }
