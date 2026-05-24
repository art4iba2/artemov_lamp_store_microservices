import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Catalog from "../pages/Catalog";
import {describe, expect, test} from "vitest";

describe("Catalog page", () => {
  test("отображает каталог товаров", () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );

    expect(screen.getByText(/каталог товаров/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/поиск по каталогу/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/максимальная цена/i)).toBeInTheDocument();
  });

  test("фильтрует товары по поиску", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/поиск по каталогу/i);

    await user.type(searchInput, "свеча");

    expect(screen.getByText(/лампа led свеча/i)).toBeInTheDocument();
    expect(screen.queryByText(/светодиодная лампа led a60/i)).not.toBeInTheDocument();
  });

  test("фильтрует товары по максимальной цене", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );

    const priceInput = screen.getByPlaceholderText(/максимальная цена/i);

    await user.type(priceInput, "160");

    expect(screen.getByText(/лампа led свеча/i)).toBeInTheDocument();
    expect(screen.queryByText(/светодиодная лампа led a60/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/лампа энергосберегающая/i)).not.toBeInTheDocument();
  });
});