import type { Components, JSX } from "../types/components";

interface ComponentGamePlanar extends Components.ComponentGamePlanar, HTMLElement {}
export const ComponentGamePlanar: {
  prototype: ComponentGamePlanar;
  new (): ComponentGamePlanar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
