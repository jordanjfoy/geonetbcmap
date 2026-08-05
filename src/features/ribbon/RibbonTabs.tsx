import { useContext, useState } from "react";
import { UIContext } from "../../context/UIContext";
import MapContext from "../../context/MapContext";
import { DrawDropdown } from "../drawing/DrawDropdown";
import { MeasureDropdown } from "../measure/MeasureTool";

export default function RibbonTabs() {
  const [tab, setTab] = useState("Navigation");
  const [action, setAction] = useState<string | null>(null);

  const context = useContext(UIContext);
  if (!context) return null;

  const { setSidebarMode } = useContext(UIContext)!;

  /* getting setActive Tool from MapContext */
  const mapCtx = useContext(MapContext);
  
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
            <button className="ribbon-button" onClick={() => mapCtx?.setExtent([-15470000, 6110000, -12690000, 8400000])}>Full Extent</button>
            <button onClick={() => mapCtx?.zoomIn()}>Zoom In</button>
            <button onClick={() => mapCtx?.zoomOut()}>Zoom Out</button>
            {/* Removed button for now <button onClick={() => mapCtx?.pan()}>Pan</button> */}
            <button onClick={() => mapCtx?.previousExtent()}>Previous Extent</button>
            <button onClick={() => mapCtx?.nextExtent()}>Next Extent</button>
            <button onClick={() => { 
              {setAction("Layers")};  
              {setSidebarMode("Layers")}
              }}>
              Layers
            </button>
            <button onClick={() => { 
              {setAction("Print")};  
              {setSidebarMode("Print")}
              }}>
              Print
            </button>
            

          </div>
        )}

        {tab === "Markup" && (
          <div className="ribbon-group">
            <DrawDropdown onSelect={(type) => setAction(`Draw: ${type}`)} />
            <button className="ribbon-button" onClick={() => {setAction("Edit"); mapCtx?.setActiveTool("edit")}}>Edit</button>
            <button className="ribbon-button" onClick={() => {setAction("Erase"); mapCtx?.setActiveTool("erase")}}>Erase</button>
            <button className="ribbon-button" onClick={() => {setAction("Clear"); mapCtx?.setActiveTool("clear")}}>Clear</button>

          </div>
        )}

        {tab === "Query" && (
          <div className="ribbon-group">
            <button onClick={() => {
              setAction("Add Feature");
              setSidebarMode("form");
            }}>
              Query
            </button>
            <button className="ribbon-button" onClick={() => {setAction("Select"); mapCtx?.setActiveTool("select")}}>Select</button>
            <button className="ribbon-button" onClick={() => setAction("Freehand")}>Search</button>
            <button className="ribbon-button" onClick={() => setAction("Distance")}>Search</button>
            <MeasureDropdown onSelect={(type) => setAction(`Measure: ${type}`)} />
          </div>
        )}

        {/* Optional feedback */}
        {action && <p>Selected: {action}</p>}
      </div>
    </>
  );
}
