const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:8001";

const ORDER_API_URL =
  import.meta.env.VITE_ORDER_API_URL || "http://localhost:8002";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "Ошибка запроса к серверу";

    try {
      const data = await response.json();
      message =
        typeof data.detail === "string"
          ? data.detail
          : data.detail?.message || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function normalizeProduct(product) {
  const image = product.images?.[0]?.url || "/placeholder-lamp.svg";

  return {
    ...product,
    id: String(product.id),
    price: Number(product.price),
    brightness: product.brightness || 0,
    image,
    base: product.base || "Не указан",
    size: product.size || "Не указан",
    type: product.type || "Лампа",
    shape: product.shape || "Не указана",
    reviews: product.reviews || []
  };
}

export async function getProducts({ page = 1, pageSize = 20, search = "", maxPrice = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize)
  });

  if (search.trim()) {
    params.set("q", search.trim());
  }

  if (maxPrice) {
    params.set("max_price", String(maxPrice));
  }

  const data = await request(`${PRODUCT_API_URL}/api/products?${params.toString()}`);

  return {
    ...data,
    items: data.items.map(normalizeProduct)
  };
}

export async function getProduct(id) {
  const product = await request(`${PRODUCT_API_URL}/api/products/${id}`);

  return normalizeProduct(product);
}

export async function createOrder({ email, phone, items }) {
  return request(`${ORDER_API_URL}/api/orders`, {
    method: "POST",
    body: JSON.stringify({
      email,
      phone,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    })
  });
}
