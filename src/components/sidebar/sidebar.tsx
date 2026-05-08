export default function Sidebar() {
  return (
    <aside className="sidebar">
        <header></header>
    </aside>
  );
}

export default function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}
