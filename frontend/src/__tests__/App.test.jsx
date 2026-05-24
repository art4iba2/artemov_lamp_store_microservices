import { render, screen } from "@testing-library/react";
import App from "../App";
import {describe, expect, test} from "vitest";

describe("App routing", () => {
  test("отображает шапку сайта", () => {
    render(<App />);

    expect(screen.getByText(/lampstore/i)).toBeInTheDocument();
    expect(screen.getAllByText(/каталог/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/контакты/i)).toBeInTheDocument();
    expect(screen.getByText(/корзина/i)).toBeInTheDocument();
  });

  test("по умолчанию открывается главная страница", () => {
    render(<App />);

    expect(screen.getByText(/интернет-магазин ламп/i)).toBeInTheDocument();
  });
});