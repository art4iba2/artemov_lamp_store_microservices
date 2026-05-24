import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Cart from "../pages/Cart";
import { addToCart } from "../utils/cart";
import {beforeEach, describe, expect, test} from "vitest";

const product = {
  id: "1",
  title: "Светодиодная лампа LED A60",
  price: 180,
  quantity: 1
};

describe("Cart page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("показывает сообщение, если корзина пустая", () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText(/корзина пуста/i)).toBeInTheDocument();
  });

  test("показывает товар в корзине", () => {
    addToCart(product);

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText(/светодиодная лампа led a60/i)).toBeInTheDocument();
    expect(screen.getByText(/количество: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/итого: 180/i)).toBeInTheDocument();
  });

  test("удаляет товар из корзины", async () => {
    const user = userEvent.setup();

    addToCart(product);

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await user.click(screen.getByText(/удалить/i));

    expect(screen.getByText(/корзина пуста/i)).toBeInTheDocument();
  });
});