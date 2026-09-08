import type { Product } from "./catalog";

export interface CartItem {
  key: string;
  product: Product;
  quantity: number;
  variants: Record<string, string>;
  unitPrice: number;
}
export interface ShippingInfo { name: string; phone: string; email?: string; province?: string; district?: string; ward?: string; fullAddress: string }
export interface OrderItem { id: string; productId: string; productName: string; productImage: string; variants: Record<string, string>; quantity: number; price: number }
export interface Order {
  id: string; orderNumber: string; customerId?: string; customerName?: string; subtotal: number; shippingFee: number;
  discount: number; total: number; shippingMethod: string; paymentMethod: string; paymentStatus: string;
  status: string; appliedVoucherCode?: string; shippingInfo?: ShippingInfo; trackingNumber?: string;
  trackingUrl?: string; items: OrderItem[]; statusLogs: string[]; createdAt: string; updatedAt: string;
}
export interface VoucherValidation { valid: boolean; error?: string; code: string; subtotal: number; discountAmount: number; freeShipping: boolean }
export interface Review { id: string; productId: string; productName: string; productSlug: string; customerName: string; rating: number; title?: string; content: string; images: string[]; verified: boolean; approved: boolean; createdAt: string }
export interface CareItem { id: string; productId: string; productName: string; careSchedule: string; lastWateredAt?: string; lastPrunedAt?: string; status: string; nextWateringAt: string }
