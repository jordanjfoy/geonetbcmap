import React from "react";

type RibbonButtonsProps = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

export const RibbonButtons = ({ label, onClick, icon }: RibbonButtonsProps) => {
  return (
    <button className="ribbon-button" onClick={onClick}>
      {icon && <div className="ribbon-button-icon">{icon}</div>}
      <span className="ribbon-button-label">{label}</span>
    </button>
  );
};
``
