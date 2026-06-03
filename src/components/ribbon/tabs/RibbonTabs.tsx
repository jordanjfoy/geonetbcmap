import { useContext, useState } from "react";
import { UIContext } from "../../../context/UIContext";
import MapContext from "../../../context/MapContext";
import { DrawDropdown } from "../content/DrawDropdown";

export default function RibbonTabs() {
  const [tab, setTab] = useState("Navigation");
  const [action, setAction] = useState<string | null>(null);

  const context = useContext(UIContext);
  if (!context) return null;

  const { setSidebarMode } = useContext(UIContext)!;

  /* getting setActive Tool from MapContext */
  const mapCtx = useContext(MapContext);
  const { setActiveTool } = mapCtx || {};

  return (
    <>
      {/* Top-level tabs */}
      <div className="ribbon">
        {["Navigation", "Markup", "Query"].map(t => (
          <button
            key={t}
            className={tab === t ? "tab active" : "tab"}
            onClick={() => {
              setTab(t);
              setAction(null); // reset nested buttons when tab changes
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Nested ribbon content */}
      <div className="content">

        {tab === "Navigation" && (
          <div className="ribbon-group">
            <button onClick={() => setAction("Full Extent")}>Full Extent</button>
            <button onClick={() => setAction("Zoom In")}>Zoom In</button>
            <button onClick={() => setAction("Zoom Out")}>Zoom Out</button>
            <button onClick={() => setAction("Pan")}>Pan</button>
            <button onClick={() => setAction("Previous Extent")}>Previous Extent</button>
            <button onClick={() => setAction("Next Extent")}>Next Extent</button>
            <button onClick={() => { 
              {setAction("Layers")};  
              {setSidebarMode("Layers")}
              }}>
              Layers
            </button>

          </div>
        )}

        {tab === "Markup" && (
          <div className="ribbon-group">
            <DrawDropdown onSelect={(type) => setAction(`Draw: ${type}`)} />
            
            <button onClick={() => setAction("Edit")}>Edit</button>
            <button onClick={() => setAction("Erase")}>Delete</button>
            <button onClick={() => setAction("Clear")}>Delete</button>
            <button onClick={() => setAction("Grid")}>Delete</button>
            <button onClick={() => setAction("Clear Grid")}>Delete</button>
            <button onClick={() => setAction("Plot Coordinates")}>Delete</button>
          </div>
        )}

        {tab === "Query" && (
          <div className="ribbon-group">
            <button onClick={() => setAction("Query")}>Select</button>
            <button onClick={() => setAction("Point")}>Search</button>
            <button onClick={() => setAction("Freehand")}>Search</button>
            <button onClick={() => setAction("Line")}>Search</button>
            <button onClick={() => setAction("Polygon")}>Search</button>
            <button onClick={() => setAction("Rectangle")}>Search</button>
            <button onClick={() => setAction("Distance")}>Search</button>
          </div>
        )}

        {/* Optional feedback */}
        {action && <p>Selected: {action}</p>}
      </div>
    </>
  );
}
