import { addToCart, getCart, getCartCount, removeFromCart, clearCart } from "../utils/cart";
import {beforeEach, describe, expect, test} from "vitest";

const product = {
  id: "1",
  title: "Светодиодная лампа LED A60",
  price: 180
};

describe("Cart logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("добавляет товар в корзину", () => {
    addToCart(product);

    const cart = getCart();

    expect(cart).toHaveLength(1);
    expect(cart[0].title).toBe("Светодиодная лампа LED A60");
    expect(cart[0].quantity).toBe(1);
  });

  test("увеличивает количество товара при повторном добавлении", () => {
    addToCart(product);
    addToCart(product);

    const cart = getCart();

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  test("считает общее количество товаров в корзине", () => {
    addToCart(product);
    addToCart(product);

    expect(getCartCount()).toBe(2);
  });

  test("удаляет товар из корзины", () => {
    addToCart(product);
    removeFromCart("1");

    expect(getCart()).toHaveLength(0);
  });

  test("очищает корзину", () => {
    addToCart(product);
    clearCart();

    expect(getCart()).toHaveLength(0);
  });
});