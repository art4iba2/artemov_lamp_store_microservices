import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const { state } = useLocation();

  return (
    <section className="confirmation">
      <h1>Заказ оформлен</h1>
      <p>Спасибо за покупку! Мы свяжемся с вами для подтверждения доставки.</p>

      {state?.orderId && (
        <p>Номер заказа: <strong>{state.orderId}</strong></p>
      )}

      <Link to="/catalog" className="button">
        Вернуться в каталог
      </Link>
    </section>
  );
}

export default Confirmation;
