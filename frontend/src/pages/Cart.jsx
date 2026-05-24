import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart } from "../utils/cart";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <section>
        <h1>Корзина</h1>
        <p>Корзина пуста.</p>
        <Link to="/catalog" className="button">Перейти в каталог</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Корзина ({cartCount} шт.)</h1>

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <h3>{item.title}</h3>
          <p>Количество: {item.quantity}</p>
          <p>Цена: {item.price} ₽</p>

          <button onClick={() => handleRemove(item.id)}>
            Удалить
          </button>
        </div>
      ))}

      <h2>Итого: {total} ₽</h2>

      <Link to="/checkout" className="button">
        Оформить заказ
      </Link>
    </section>
  );
}

export default Cart;