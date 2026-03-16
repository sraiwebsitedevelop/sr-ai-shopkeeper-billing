export interface OrderItem {
  productName: string;
  photoBase64: string;
  price: number;
  discount: number;
  itemTotal: number;
}

export interface Prescription {
  photoBase64: string;
  rightSph: string;
  rightCyl: string;
  rightAxis: string;
  rightNear: string;
  leftSph: string;
  leftCyl: string;
  leftAxis: string;
  leftNear: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  items: OrderItem[];
  prescription?: Prescription;
  total: number;
  discountAmount: number;
  grandTotal: number;
  advance: number;
  dues: number;
  netTotal: number;
  transactionType: string;
  status: "pending" | "delivered";
  createdAt: number;
  deliveryDate?: string;
}

export interface ShopProfile {
  shopName: string;
  mobileNumber: string;
  logoBase64?: string;
}
