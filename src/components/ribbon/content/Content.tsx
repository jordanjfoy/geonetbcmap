

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
            <RibbonButton
              icon={<ClipboardPaste />}
              label="Paste"
              onClick={() => console.log("Paste")}
            />
            <RibbonButton
              icon={<Copy />}
              label="Copy"
              onClick={() => console.log("Copy")}
            />
          </RibbonGroup>

          <RibbonGroup title="Font">
            <RibbonButton
              icon={<Bold />}
              label="Bold"
              onClick={() => console.log("Bold")}
            />
            <RibbonButton
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
            <RibbonButton
              label="Undo"
              onClick={() => console.log("Undo")}
            />
            <RibbonButton
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
            <RibbonButton
              label="Zoom In"
              onClick={() => console.log("Zoom In")}
            />
            <RibbonButton
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

