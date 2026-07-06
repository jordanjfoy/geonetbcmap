export const RibbonGroup = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="ribbon-group">
      <h3>{title}</h3>
      <div className="ribbon-buttons">
        {children}
      </div>
    </div>
  );
};
