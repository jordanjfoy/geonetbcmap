import { useContext, useState } from "react";
import { UIContext } from "../context/UIContext";
import { FeatureForm } from "../features/query/FeatureForm";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { sidebarMode } = useContext(UIContext)!;
  const normalizedMode = sidebarMode?.toLowerCase();

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className='toggle-button' onClick={toggleSidebar}>
        T
      </button>
      <header></header>
      <div className="sidebar-content">
        {normalizedMode === "layers" && <div>Layers Panel</div>}
        {normalizedMode === "form" && <FeatureForm />}
        {normalizedMode === "query" && <FeatureForm />}
      </div>
    </aside>
  );
}
