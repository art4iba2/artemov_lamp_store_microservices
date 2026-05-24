const CART_KEY = "cart";

function notifyCartUpdated() {
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdated();
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
}

export function getCartCount() {
  const cart = getCart();

  return cart.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);
}