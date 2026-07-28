import DrawInteraction from './interactions/DrawInteraction';
import ModifyInteraction from './interactions/ModifyInteraction';
import SelectBoxInteraction from './interactions/SelectBoxInteraction';

export default function MapInteractions() {
  return (
    <>
      <DrawInteraction />
      <ModifyInteraction />
      <SelectBoxInteraction />
    </>
  );
}