import "@testing-library/jest-dom";
import { vi } from "vitest";

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    }),

    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),

    removeItem: vi.fn((key) => {
      delete store[key];
    }),

    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true
});