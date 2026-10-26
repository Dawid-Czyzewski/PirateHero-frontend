import "@testing-library/jest-dom/vitest";
import { createElement, type ReactNode } from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    className?: string;
    onClick?: () => void;
  }) => createElement("a", { href, ...props }, children),
}));

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src,
    ...props
  }: {
    alt?: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
  }) =>
    createElement("img", {
      alt,
      src: typeof src === "string" ? src : "",
      ...props,
    }),
}));
