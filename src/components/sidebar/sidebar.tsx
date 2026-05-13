import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className='toggle-button' onClick={toggleSidebar}>
        T
      </button>
      <header>Menu</header>
    </aside>
  );
}
