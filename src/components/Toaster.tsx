import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

export type ToastInput = {
  tone?: ToastTone;
  title: string;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  /** Milliseconds on screen. 0 keeps the toast until it is dismissed. */
  duration?: number;
  /** Replaces any live toast carrying the same key instead of stacking a second copy. */
  dedupeKey?: string;
};

type Toast = Omit<ToastInput, 'tone' | 'duration'> & {
  id: number;
  tone: ToastTone;
  duration: number;
};

/**
 * Errors stay until dismissed: a failed submission often needs re-reading, and
 * WCAG 2.2.1 discourages timing out content the reader still needs.
 */
const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 6000,
  info: 8000,
  warning: 10000,
  error: 0,
};

const MAX_VISIBLE = 3;

const ICONS: Record<ToastTone, typeof Info> = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

type ToastApi = {
  show: (input: ToastInput) => number;
  success: (title: string, rest?: Omit<ToastInput, 'title' | 'tone'>) => number;
  error: (title: string, rest?: Omit<ToastInput, 'title' | 'tone'>) => number;
  warning: (title: string, rest?: Omit<ToastInput, 'title' | 'tone'>) => number;
  info: (title: string, rest?: Omit<ToastInput, 'title' | 'tone'>) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>.');
  return api;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((input: ToastInput) => {
    const tone = input.tone ?? 'info';
    const id = nextId.current++;
    const toast: Toast = {
      ...input,
      id,
      tone,
      duration: input.duration ?? DEFAULT_DURATION[tone],
    };
    setToasts((current) => {
      const kept = input.dedupeKey
        ? current.filter((existing) => existing.dedupeKey !== input.dedupeKey)
        : current;
      return [...kept, toast].slice(-MAX_VISIBLE);
    });
    return id;
  }, []);

  const api = useMemo<ToastApi>(() => {
    const withTone =
      (tone: ToastTone) => (title: string, rest?: Omit<ToastInput, 'title' | 'tone'>) =>
        show({ ...rest, title, tone });
    return {
      show,
      dismiss,
      success: withTone('success'),
      error: withTone('error'),
      warning: withTone('warning'),
      info: withTone('info'),
    };
  }, [show, dismiss]);

  const polite = toasts.filter((toast) => toast.tone !== 'error');
  const assertive = toasts.filter((toast) => toast.tone === 'error');

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/*
        Both lists stay mounted so screen readers have registered the live
        regions before the first toast is inserted into one of them.
      */}
      <div className="toastViewport">
        <ol className="toastList" aria-live="polite" aria-label="Notifications">
          {polite.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </ol>
        <ol className="toastList" aria-live="assertive" aria-label="Errors">
          {assertive.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </ol>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const Icon = ICONS[toast.tone];

  useEffect(() => {
    if (!toast.duration || paused || remaining.current <= 0) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [paused, toast.duration, toast.id, onDismiss]);

  return (
    <li
      className={`toast toast--${toast.tone}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon className="toastIcon" size={18} aria-hidden="true" />
      <div className="toastBody">
        <p className="toastTitle">{toast.title}</p>
        {toast.description ? <p className="toastText">{toast.description}</p> : null}
        {toast.action ? (
          <button
            type="button"
            className="toastAction"
            onClick={() => {
              onDismiss(toast.id);
              toast.action?.onClick();
            }}
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className="toastClose"
        onClick={() => onDismiss(toast.id)}
        aria-label={`Dismiss: ${toast.title}`}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </li>
  );
}
