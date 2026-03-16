import type { Order, ShopProfile } from "../types";

const ORDERS_KEY = "srai_orders";
const PROFILE_KEY = "srai_profile";

export function getOrders(): Order[] {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function deleteOrder(id: string): void {
  const orders = getOrders().filter((o) => o.id !== id);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getProfile(): ShopProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data
      ? JSON.parse(data)
      : {
          shopName: "SR.AI Website Developer",
          mobileNumber: "",
          logoBase64: "",
        };
  } catch {
    return {
      shopName: "SR.AI Website Developer",
      mobileNumber: "",
      logoBase64: "",
    };
  }
}

export function saveProfile(profile: ShopProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function generateId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
