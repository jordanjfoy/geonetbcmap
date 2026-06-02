import { useContext, useState } from "react";
import { UIContext } from "../../context/UIContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { sidebarMode } = useContext(UIContext)!;


  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className='toggle-button' onClick={toggleSidebar}>
        T
      </button>
      <header>Menu</header>
      <div className="sidebar-content">
        {sidebarMode === "layers" && <div> Layers Panel</div>}
      </div>
    </aside>
  );
}
