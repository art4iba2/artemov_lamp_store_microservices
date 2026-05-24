import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart, getCart } from "../utils/cart";
import { createOrder } from "../api/client";

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.phone) {
      alert("Заполните почту и номер телефона");
      return;
    }

    const cart = getCart();

    if (cart.length === 0) {
      alert("Корзина пуста");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        ...form,
        items: cart
      });

      clearCart();
      navigate("/confirmation", { state: { orderId: order.id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Оформление заказа</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Почта
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </label>

        <label>
          Номер телефона
          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
          />
        </label>

        <div className="delivery-info">
          <p><strong>Доставка:</strong> только курьером.</p>
          <p><strong>Оплата:</strong> курьеру наличными или картой при получении.</p>
          <p>Предоплата на сайте не требуется.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправка заказа..." : "Подтвердить заказ"}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
