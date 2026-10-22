import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { MembershipCategory } from '../data/site';
import { JoinModal } from '../components/JoinModal';

type OpenJoin = (category?: MembershipCategory) => void;

const JoinContext = createContext<OpenJoin>(() => {});

export function useJoin(): OpenJoin {
  return useContext(JoinContext);
}

export function JoinProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<MembershipCategory | undefined>();
  const lastFocus = useRef<HTMLElement | null>(null);

  const openJoin = useCallback<OpenJoin>((category) => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPreset(category);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) return;
    const node = lastFocus.current;
    if (!node) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (node.isConnected) node.focus();
        else document.querySelector<HTMLElement>('[data-join-trigger]')?.focus();
        lastFocus.current = null;
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <JoinContext.Provider value={openJoin}>
      {children}
      <JoinModal open={open} preset={preset} onClose={() => setOpen(false)} />
    </JoinContext.Provider>
  );
}
