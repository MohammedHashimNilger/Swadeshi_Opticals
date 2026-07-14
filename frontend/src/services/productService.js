import api from "./api";

export async function fetchProductColors() {
  const { data } = await api.get("/products/meta/colors");
  return data;
}

export async function fetchLensColors() {
  const { data } = await api.get("/products/meta/lens-colors");
  return data;
}

// `filters` is a plain object like { category, gender, minPrice, sort, page }.
// axios's `params` option automatically turns it into a query string and
// drops any keys with undefined values, so callers don't need to build
// the query string themselves.
export async function fetchProducts(filters = {}) {
  const { data } = await api.get("/products", { params: filters });
  return data; // { products, total, page, totalPages }
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data;
}
