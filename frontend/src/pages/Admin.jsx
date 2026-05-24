import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminLogin,
  createProduct,
  deleteProduct,
  getAdminOrders,
  getAdminProducts,
  updateOrderStatus,
  updateProduct
} from "../api/client";

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  brightness: "",
  stock: "",
  imageUrl: ""
};

const orderStatuses = [
  "new",
  "processing",
  "delivering",
  "completed",
  "cancelled"
];

const statusLabels = {
  new: "Новый",
  processing: "В обработке",
  delivering: "Доставка",
  completed: "Завершён",
  cancelled: "Отменён"
};

function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(token);

  const totalOrders = useMemo(() => orders.length, [orders]);
  const totalProducts = useMemo(() => products.length, [products]);

  async function loadData(currentToken = token) {
    if (!currentToken) return;

    setLoading(true);
    setError("");

    try {
      const [productData, orderData] = await Promise.all([
        getAdminProducts(currentToken),
        getAdminOrders(currentToken)
      ]);

      setProducts(productData.items || []);
      setOrders(orderData.items || []);
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("автор") || err.message.toLowerCase().includes("token")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadData(token);
    }
  }, [isLoggedIn, token]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const data = await adminLogin(loginForm);
      localStorage.setItem("adminToken", data.access_token);
      setToken(data.access_token);
      setNotice("Вход выполнен");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setToken("");
    setProducts([]);
    setOrders([]);
    setEditingId(null);
    setProductForm(emptyProduct);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setProductForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price ?? "",
      brightness: product.brightness ?? "",
      stock: product.stock ?? "",
      imageUrl: product.images?.[0]?.url || ""
    });
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setProductForm(emptyProduct);
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      title: productForm.title.trim(),
      description: productForm.description.trim() || null,
      price: Number(productForm.price),
      brightness: productForm.brightness === "" ? null : Number(productForm.brightness),
      stock: Number(productForm.stock || 0),
      images: productForm.imageUrl.trim() ? [{ url: productForm.imageUrl.trim() }] : []
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload, token);
        setNotice("Товар обновлён");
      } else {
        await createProduct(payload, token);
        setNotice("Товар добавлен");
      }

      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Удалить товар?")) return;

    setError("");
    setNotice("");

    try {
      await deleteProduct(id, token);
      setNotice("Товар удалён");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleOrderStatus(id, status) {
    setError("");
    setNotice("");

    try {
      await updateOrderStatus(id, status, token);
      setOrders((items) =>
        items.map((order) => (order.id === id ? { ...order, status } : order))
      );
      setNotice("Статус заказа обновлён");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isLoggedIn) {
    return (
      <section className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <Link to="/" className="admin-back-link">← На витрину магазина</Link>
          <h1>Панель администратора</h1>
          <p>Войдите, чтобы управлять товарами и заказами.</p>

          <label>
            Логин
            <input
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm({ ...loginForm, username: event.target.value })
              }
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm({ ...loginForm, password: event.target.value })
              }
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Войти</button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <h2>LampStore</h2>
          <p>Администрирование</p>
        </div>

        <nav className="admin-nav">
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Товары
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Заказы
          </button>
        </nav>

        <div className="admin-sidebar-actions">
          <Link to="/" className="button secondary">На витрину</Link>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <h1>Панель управления</h1>
            <p>Страница администратора открывается отдельно: <strong>/admin</strong></p>
          </div>

          <div className="admin-stats">
            <span>Товаров: {totalProducts}</span>
            <span>Заказов: {totalOrders}</span>
          </div>
        </header>

        {notice && <p className="success-message">{notice}</p>}
        {error && <p className="error-message">{error}</p>}
        {loading && <p>Загрузка данных...</p>}

        {activeTab === "products" && (
          <>
            <form className="admin-card admin-form" onSubmit={handleSaveProduct}>
              <h2>{editingId ? "Редактировать товар" : "Добавить товар"}</h2>

              <div className="admin-form-grid">
                <label>
                  Название
                  <input
                    value={productForm.title}
                    onChange={(event) =>
                      setProductForm({ ...productForm, title: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Цена
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm({ ...productForm, price: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Яркость
                  <input
                    type="number"
                    min="0"
                    value={productForm.brightness}
                    onChange={(event) =>
                      setProductForm({ ...productForm, brightness: event.target.value })
                    }
                  />
                </label>

                <label>
                  Остаток
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(event) =>
                      setProductForm({ ...productForm, stock: event.target.value })
                    }
                    required
                  />
                </label>

                <label className="admin-wide">
                  URL изображения
                  <input
                    value={productForm.imageUrl}
                    onChange={(event) =>
                      setProductForm({ ...productForm, imageUrl: event.target.value })
                    }
                  />
                </label>

                <label className="admin-wide">
                  Описание
                  <textarea
                    rows="4"
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm({ ...productForm, description: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button type="submit">{editingId ? "Сохранить" : "Добавить"}</button>
                {editingId && (
                  <button type="button" className="secondary" onClick={cancelEdit}>
                    Отмена
                  </button>
                )}
              </div>
            </form>

            <div className="admin-card">
              <h2>Список товаров</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Цена</th>
                      <th>Остаток</th>
                      <th>Архив</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{Number(product.price).toFixed(2)} ₽</td>
                        <td>{product.stock}</td>
                        <td>{product.is_archived ? "Да" : "Нет"}</td>
                        <td className="admin-row-actions">
                          <button type="button" onClick={() => startEdit(product)}>
                            Изменить
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="admin-card">
            <h2>Заказы</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Номер</th>
                    <th>Клиент</th>
                    <th>Состав</th>
                    <th>Дата</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <strong>{order.email}</strong>
                        <br />
                        {order.phone}
                      </td>
                      <td>
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.product_id} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>{new Date(order.created_at).toLocaleString("ru-RU")}</td>
                      <td>
                        <select
                          value={order.status || "new"}
                          onChange={(event) =>
                            handleOrderStatus(order.id, event.target.value)
                          }
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin;
