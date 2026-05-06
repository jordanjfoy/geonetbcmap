

import React from "react";
import { RibbonGroup } from "./RibbonGroup";
import { RibbonButtons } from "./RibbonButtons";
import { Bold, Italic, Copy, ClipboardPaste } from "lucide-react";

export type RibbonTab = "home" | "edit" | "view";

type RibbonContentProps = {
  activeTab: RibbonTab;
};

export const RibbonContent: React.FC<RibbonContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case "home":
      return (
        <div className="ribbon-content">
          <RibbonGroup title="Clipboard">
            <RibbonButtons
              icon={<ClipboardPaste />}
              label="Paste"
              onClick={() => console.log("Paste")}
            />
            <RibbonButtons
              icon={<Copy />}
              label="Copy"
              onClick={() => console.log("Copy")}
            />
          </RibbonGroup>

          <RibbonGroup title="Font">
            <RibbonButtons
              icon={<Bold />}
              label="Bold"
              onClick={() => console.log("Bold")}
            />
            <RibbonButtons
              icon={<Italic />}
              label="Italic"
              onClick={() => console.log("Italic")}
            />
          </RibbonGroup>
        </div>
      );

    case "edit":
      return (
        <div className="ribbon-content">
          <RibbonGroup title="Edit Tools">
            <RibbonButtons
              label="Undo"
              onClick={() => console.log("Undo")}
            />
            <RibbonButtons
              label="Redo"
              onClick={() => console.log("Redo")}
            />
          </RibbonGroup>
        </div>
      );

    case "view":
      return (
        <div className="ribbon-content">
          <RibbonGroup title="Display">
            <RibbonButtons
              label="Zoom In"
              onClick={() => console.log("Zoom In")}
            />
            <RibbonButtons
              label="Zoom Out"
              onClick={() => console.log("Zoom Out")}
            />
          </RibbonGroup>
        </div>
      );

    default:
      return null;
  }
};

