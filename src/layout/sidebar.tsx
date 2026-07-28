import { useContext, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { UIContext } from "../context/UIContext";
import { WfsQuery } from "../features/query/FeatureForm";
import LayerControl from '../features/layers/LayerControl'; 

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const { sidebarMode } = useContext(UIContext)!;
  const normalizedMode = sidebarMode?.toLowerCase();

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  function startResize(e: ReactMouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (event: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const nextWidth = event.clientX - rect.left;
      setSidebarWidth(Math.min(Math.max(nextWidth, 220), 600));
    };

    const onMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{ width: collapsed ? 60 : sidebarWidth }}
    >
      <div className="resize-handle" onMouseDown={startResize} />
      <button className='toggle-button' onClick={toggleSidebar}>
        {collapsed ? "→" : "←"}
      </button>
      <header></header>
      <div className="sidebar-content">
        {normalizedMode === "layers" && <LayerControl />}
        {normalizedMode === "form" && <WfsQuery />}
      </div>
    </aside>
  );
}
