import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar, Package, Phone, Search, User } from "lucide-react";
import { useState } from "react";
import AppHeader from "../components/AppHeader";
import OrderDetailView from "../components/OrderDetailView";
import type { Order } from "../types";
import { getOrders } from "../utils/storage";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const orders = getOrders();
  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerMobile.includes(search),
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Total Order Bills" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="orders.search_input"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="orders.empty_state">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <button
                type="button"
                key={order.id}
                className="w-full text-left"
                onClick={() => setSelected(order)}
                data-ocid={`orders.item.${i + 1}`}
              >
                <OrderCard order={order} />
              </button>
            ))}
          </div>
        )}
      </main>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[90vh] overflow-y-auto"
          data-ocid="orders.detail.sheet"
        >
          <SheetHeader className="pb-4">
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          {selected && <OrderDetailView order={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 border-border/60">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">{order.customerName}</span>
          </div>
          <Badge
            variant={order.status === "delivered" ? "default" : "secondary"}
            className={
              order.status === "delivered"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
            }
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Phone className="h-3 w-3" />
          {order.customerMobile}
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </div>
          <span
            className="font-bold text-sm"
            style={{ color: "oklch(0.45 0.18 255)" }}
          >
            &#x20b9;{order.grandTotal}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
