import type { ElementsMap, ExcalidrawTextElement } from "../../element/types";
import { refreshTextDimensions } from "../../element/newElement";
import StatsDragInput from "./DragInput";
import type { DragInputCallbackType } from "./DragInput";
import { mutateElement } from "../../element/mutateElement";
import { getStepSizedValue } from "./utils";

interface FontSizeProps {
  element: ExcalidrawTextElement;
  elementsMap: ElementsMap;
}

const MIN_FONT_SIZE = 4;
const STEP_SIZE = 4;

const FontSize = ({ element, elementsMap }: FontSizeProps) => {
  const handleFontSizeChange: DragInputCallbackType = (
    accumulatedChange,
    instantChange,
    stateAtStart,
    shouldKeepAspectRatio,
    shouldChangeByStepSize,
    nextValue,
  ) => {
    if (nextValue) {
      const nextFontSize = Math.max(Math.round(nextValue), MIN_FONT_SIZE);

      const newElement = {
        ...element,
        fontSize: nextFontSize,
      };
      const updates = refreshTextDimensions(newElement, null, elementsMap);
      mutateElement(element, {
        ...updates,
        fontSize: nextFontSize,
      });
      return;
    }

    if (stateAtStart && stateAtStart.type === "text") {
      const originalFontSize = Math.round(stateAtStart.fontSize);
      const changeInFontSize = Math.round(accumulatedChange);
      let nextFontSize = Math.max(
        originalFontSize + changeInFontSize,
        MIN_FONT_SIZE,
      );
      if (shouldChangeByStepSize) {
        nextFontSize = getStepSizedValue(nextFontSize, STEP_SIZE);
      }
      const newElement = {
        ...element,
        fontSize: nextFontSize,
      };
      const updates = refreshTextDimensions(newElement, null, elementsMap);
      mutateElement(element, {
        ...updates,
        fontSize: nextFontSize,
      });
    }
  };

  return (
    <StatsDragInput
      label="F"
      value={Math.round(element.fontSize * 10) / 10}
      element={element}
      dragInputCallback={handleFontSizeChange}
    />
  );
};

export default FontSize;