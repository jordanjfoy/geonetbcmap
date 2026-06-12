import { createContext, useState, ReactNode } from "react";

type UIContextType = {
  sidebarMode: string | null;
  setSidebarMode: (mode: string | null) => void;
};

export const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<string | null>(null);

    return (
        <UIContext.Provider value={{ sidebarMode, setSidebarMode }}>
        {children}
        </UIContext.Provider>
    );

}