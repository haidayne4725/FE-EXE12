import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types/catalog";
import type { CartItem } from "../types/commerce";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  update: (itemKey: string, quantity: number) => void;
  remove: (itemKey: string) => void;
  clear: () => void;
}
const CartContext = createContext<CartContextValue | null>(null);

function cartKey(productId: string, variants: Record<string, string>) {
  return `${productId}:${JSON.stringify(Object.entries(variants).sort(([left], [right]) => left.localeCompare(right)))}`;
}

function selectedUnitPrice(product: Product, variants: Record<string, string>) {
  const adjustment = product.variants
    .filter((variant) => variants[variant.variantType] === variant.value)
    .reduce((sum, variant) => sum + variant.priceAdjustment, 0);
  return product.effectivePrice + adjustment;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("terrarium-cart") || "[]") as Array<Partial<CartItem> & Pick<CartItem, "product" | "quantity" | "variants">>;
      return stored.map((item) => ({
        ...item,
        key: item.key || cartKey(item.product.id, item.variants),
        unitPrice: item.unitPrice ?? selectedUnitPrice(item.product, item.variants),
      }));
    }
    catch { return []; }
  });
  useEffect(() => localStorage.setItem("terrarium-cart", JSON.stringify(items)), [items]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    add: (product, quantity = 1, variants = {}) => setItems((current) => {
      const key = cartKey(product.id, variants);
      const existing = current.find((item) => item.key === key);
      return existing ? current.map((item) => item === existing ? { ...item, quantity: Math.min(product.inventory, item.quantity + quantity) } : item)
        : [...current, { key, product, quantity: Math.min(product.inventory, quantity), variants, unitPrice: selectedUnitPrice(product, variants) }];
    }),
    update: (itemKey, quantity) => setItems((current) => current.map((item) => item.key === itemKey
      ? { ...item, quantity: Math.max(1, Math.min(item.product.inventory, quantity)) } : item)),
    remove: (itemKey) => setItems((current) => current.filter((item) => item.key !== itemKey)),
    clear: () => setItems([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
