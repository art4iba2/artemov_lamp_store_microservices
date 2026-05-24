import { useEffect, useState } from "react";
import { getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

function Catalog() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const perPage = 20;

  useEffect(() => {
    let isActual = true;

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts({
          page,
          pageSize: perPage,
          search,
          maxPrice
        });

        if (isActual) {
          setProducts(data.items);
          setTotalPages(Math.max(1, Math.ceil(data.total / data.page_size)));
        }
      } catch (err) {
        if (isActual) {
          setError(err.message);
        }
      } finally {
        if (isActual) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isActual = false;
    };
  }, [page, search, maxPrice]);

  return (
    <section>
      <h1>Каталог товаров</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по каталогу"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="number"
          placeholder="Максимальная цена"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading && <p>Загрузка каталога...</p>}

      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && products.length === 0 && <p>Товары не найдены.</p>}

      {!isLoading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </section>
  );
}

export default Catalog;
