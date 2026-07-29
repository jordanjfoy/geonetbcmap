import { useEffect, useState } from 'react';

interface Props {
  active: boolean;
}

export default function EraseCursor({ active }: Props) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div
      className="erase-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}