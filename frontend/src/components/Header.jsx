import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCartCount } from "../utils/cart";

function Header() {
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo">LampStore</Link>

      <nav>
        <Link to="/catalog">Каталог</Link>
        <Link to="/contacts">Контакты</Link>

        <div className="cart-icon">
          <Link to="/cart">
            Корзина
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;