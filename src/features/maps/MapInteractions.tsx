import DrawInteraction from './interactions/DrawInteraction';
import ModifyInteraction from './interactions/ModifyInteraction';
import SelectBoxInteraction from './interactions/SelectBoxInteraction';
import ClearInteraction from './interactions/ClearInteraction';
import EraseInteraction from './interactions/EraseInteraction';

export default function MapInteractions() {
  return (
    <>
      <DrawInteraction />
      <ModifyInteraction />
      <SelectBoxInteraction />
      <ClearInteraction />
      <EraseInteraction /> 
    </>
  );
}