import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Checkout from "../pages/Checkout";
import Confirmation from "../pages/Confirmation";
import {beforeEach, describe, expect, test} from "vitest";

describe("Checkout page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("отображает форму оформления заказа", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/оформление заказа/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/почта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/номер телефона/i)).toBeInTheDocument();
    expect(screen.getByText(/доставка/i)).toBeInTheDocument();
    expect(screen.getByText(/курьеру наличными или картой при получении/i)).toBeInTheDocument();
  });

  test("после заполнения формы переходит на страницу подтверждения", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/почта/i), "test@mail.ru");
    await user.type(screen.getByLabelText(/номер телефона/i), "+79000000000");
    await user.click(screen.getByText(/подтвердить заказ/i));

    expect(screen.getByText(/заказ оформлен/i)).toBeInTheDocument();
  });
});