import React, { useContext } from 'react';
import MapContext from '../../context/MapContext';

export default function BaseLayerSwitcher() {
  const context = useContext(MapContext);
  if (!context) return null;

    const { baseLayersRef } = context;
        function switchBaseLayer(selectedName: string) {
            
            const layers = baseLayersRef.current.getLayers().getArray();

            layers.forEach((layer: any) => {
                const name = layer.get('name');
                layer.setVisible(name === selectedName);
            });
    }

    
    return (
    <select onChange={(e) => switchBaseLayer(e.target.value)}>
        <option value="OSM">OSM</option>
        <option value="BC Vector">BC Vector</option>
        <option value="Imagery">Imagery</option>
    </select>
    );

}