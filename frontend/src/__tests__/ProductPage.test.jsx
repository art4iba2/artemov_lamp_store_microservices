import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProductPage from "../pages/ProductPage";
import {beforeEach, describe, expect, test} from "vitest";

describe("Product page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("отображает детальную информацию о товаре", () => {
    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/светодиодная лампа led a60/i)).toBeInTheDocument();
    expect(screen.getByText(/яркость/i)).toBeInTheDocument();
    expect(screen.getByText(/цоколь/i)).toBeInTheDocument();
    expect(screen.getByText(/размеры/i)).toBeInTheDocument();
    expect(screen.getByText(/тип/i)).toBeInTheDocument();
    expect(screen.getByText(/форма/i)).toBeInTheDocument();
  });

  test("покупатель может оставить отзыв", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/введите имя/i), "Анна");
    await user.type(
      screen.getByPlaceholderText(/напишите отзыв/i),
      "Хорошая лампа, ярко светит"
    );

    await user.click(screen.getByRole("button", { name: /оставить отзыв/i }));

    expect(screen.getByText(/анна/i)).toBeInTheDocument();
    expect(screen.getByText(/хорошая лампа, ярко светит/i)).toBeInTheDocument();
  });

  test("показывает сообщение, если товар не найден", () => {
    render(
      <MemoryRouter initialEntries={["/product/999"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/товар не найден/i)).toBeInTheDocument();
  });
});