
import { useState } from "react";

export default function RibbonTabs() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <div className="ribbon">
        {["Navigation", "Markup", "Query"].map(t => (
          <button
            key={t}
            className={tab === t ? "tab active" : "tab"}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="content">
        {tab === "Navigation" && <p>Home content</p>}
        {tab === "Markup" && <p>Markup content</p>}
        {tab === "Query" && <p>Query content</p>}
      </div>
    </>
  );
}
