const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:8001";

const ORDER_API_URL =
  import.meta.env.VITE_ORDER_API_URL || "http://localhost:8002";

async function request(url, options = {}) {
  const { headers = {}, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });

  if (!response.ok) {
    let message = "Ошибка запроса к серверу";

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => {
            const field = Array.isArray(item.loc) ? item.loc.join(".") : "поле";
            return `${field}: ${item.msg}`;
          })
          .join("; ");
      } else {
        message = data.detail?.message || message;
      }
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

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
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

export async function adminLogin({ username, password }) {
  return request(`${PRODUCT_API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export async function getAdminProducts(token) {
  const data = await request(`${PRODUCT_API_URL}/api/products?include_archived=true&page_size=100`, {
    headers: authHeaders(token)
  });

  return {
    ...data,
    items: data.items.map(normalizeProduct)
  };
}

export async function createProduct(product, token) {
  return request(`${PRODUCT_API_URL}/api/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(product)
  });
}

export async function updateProduct(id, product, token) {
  const payload = { ...product };
  delete payload.images;

  return request(`${PRODUCT_API_URL}/api/products/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteProduct(id, token) {
  return request(`${PRODUCT_API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
}

export async function getAdminOrders(token) {
  return request(`${ORDER_API_URL}/api/orders?page_size=100`, {
    headers: authHeaders(token)
  });
}

export async function updateOrderStatus(id, status, token) {
  return request(`${ORDER_API_URL}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status })
  });
}
