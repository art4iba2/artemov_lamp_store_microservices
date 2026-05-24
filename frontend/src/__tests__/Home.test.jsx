import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import {describe, expect} from "vitest";

describe("Home page", () => {
  test("отображает главную страницу и блок акций", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/интернет-магазин ламп/i)).toBeInTheDocument();
    expect(screen.getByText(/акции и распродажи/i)).toBeInTheDocument();
    expect(screen.getByText(/перейти в каталог/i)).toBeInTheDocument();
  });
});