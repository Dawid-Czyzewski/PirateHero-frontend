import type { Step } from "@/modules/character/appearance";

const ARROW_STEPS: Partial<Record<string, Step>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export function arrowStep(key: string): Step | undefined {
  return ARROW_STEPS[key];
}

export function focusNth(container: HTMLElement, selector: string, index: number): void {
  container.querySelectorAll<HTMLElement>(selector)[index]?.focus();
}
