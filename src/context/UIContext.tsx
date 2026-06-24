
import { createContext, useState, ReactNode } from "react";

export type PopupData = {
  properties: Record<string, any>;
  coordinates: [number, number];
  featureId?: string | number;
};

type UIContextType = {
  sidebarMode: string | null;
  setSidebarMode: (mode: string | null) => void;
  popupData: PopupData | null;
  setPopupData: (data: PopupData | null) => void;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
};

export const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<string | null>(null);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);

    return (
        <UIContext.Provider value={{ 
          sidebarMode, 
          setSidebarMode,
          popupData,
          setPopupData,
          showPopup,
          setShowPopup
        }}>
        {children}
        </UIContext.Provider>
    );

}
