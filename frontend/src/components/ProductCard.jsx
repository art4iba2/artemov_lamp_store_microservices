import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.title} />

      <h3>{product.title}</h3>
      <p>{product.price} ₽</p>

      <div className="card-actions">
        <Link to={`/product/${product.id}`} className="button secondary">
          Подробнее
        </Link>

        <button onClick={() => addToCart(product)}>
          В корзину
        </button>
      </div>
    </article>
  );
}

export default ProductCard;