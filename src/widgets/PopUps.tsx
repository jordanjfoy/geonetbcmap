
import { useContext } from 'react';
import MapContext from '../context/MapContext';
import { Overlay } from 'ol';

export default function PopUps() {
    const ctx = useContext(MapContext);

    if (!ctx || !ctx.map) return null;
    
    /*creates an overlayElement which */
    const overlayElement = document.getElementById('popup');
    
    
    const overlay = new Overlay({
    element: overlayElement,
    positioning: 'bottom-center', // Controls the positioning of the overlay
    stopEvent: false,
    });

    }   