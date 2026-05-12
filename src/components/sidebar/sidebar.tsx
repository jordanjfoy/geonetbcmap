
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={toggleSidebar}>
        Toggle
      </button>

      <header>Menu</header>
    </aside>
  );
}
