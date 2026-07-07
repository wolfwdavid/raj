import { browser } from '$app/environment';
import type { Product } from '$lib/data/products';

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  accent: string;
  qty: number;
}

const STORAGE_KEY = 'vfamigos_cart_v1';

// Runes state — starts EMPTY so SSR/prerender renders an empty cart (never touches
// localStorage on the server). Client hydrates from storage after mount via hydrate().
let items = $state<CartItem[]>([]);

// Persist is browser-only — never called during prerender.
function persist(): void {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full / disabled — cart still works in-memory this session */
  }
}

// Call once from a component onMount (client-only). Safe no-op on the server.
export function hydrate(): void {
  if (!browser) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed;
    }
  } catch {
    /* corrupt payload — ignore, keep empty */
  }
}

export const cart = {
  get items(): CartItem[] {
    return items;
  },
  get count(): number {
    return items.reduce((n, i) => n + i.qty, 0);
  },
  get subtotal(): number {
    return items.reduce((s, i) => s + i.price * i.qty, 0);
  },
  add(product: Product): void {
    const existing = items.find((i) => i.slug === product.slug);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        accent: product.accent,
        qty: 1
      });
    }
    persist();
  },
  setQty(slug: string, qty: number): void {
    const item = items.find((i) => i.slug === slug);
    if (!item) return;
    if (qty <= 0) {
      cart.remove(slug);
      return;
    }
    item.qty = qty;
    persist();
  },
  remove(slug: string): void {
    items = items.filter((i) => i.slug !== slug);
    persist();
  },
  clear(): void {
    items = [];
    persist();
  }
};
