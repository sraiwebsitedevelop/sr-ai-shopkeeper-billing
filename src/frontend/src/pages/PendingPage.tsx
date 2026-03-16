import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppHeader from "../components/AppHeader";
import OrderDetailView from "../components/OrderDetailView";
import type { Order } from "../types";
import { getOrders, saveOrder } from "../utils/storage";

export default function PendingPage() {
  const [orders, setOrders] = useState(() =>
    getOrders().filter((o) => o.status === "pending"),
  );
  const [selected, setSelected] = useState<Order | null>(null);

  function handleMarkDelivered(order: Order) {
    const updated = { ...order, status: "delivered" as const };
    saveOrder(updated);
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setSelected(null);
    toast.success("Order marked as delivered!");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Pending Bills" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">
            {orders.length} pending order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16" data-ocid="pending.empty_state">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No pending orders</p>
            <p className="text-xs text-muted-foreground mt-1">
              All orders have been delivered!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <Card
                key={order.id}
                className="shadow-card border-border/60"
                data-ocid={`pending.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">
                        {order.customerName}
                      </span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Phone className="h-3 w-3" />
                    {order.customerMobile}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Order:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <span
                      className="font-bold text-sm"
                      style={{ color: "oklch(0.45 0.18 255)" }}
                    >
                      &#x20b9;{order.grandTotal}
                    </span>
                  </div>
                  {order.deliveryDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Truck className="h-3 w-3" />
                      Delivery:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 mt-3"
                    onClick={() => setSelected(order)}
                    data-ocid={`pending.view.button.${i + 1}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
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
          data-ocid="pending.detail.sheet"
        >
          <SheetHeader className="pb-4">
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          {selected && (
            <>
              <OrderDetailView order={selected} />
              <div className="mt-6 pb-6">
                <Button
                  className="w-full h-12 gap-2 gradient-brand text-white border-0"
                  onClick={() => handleMarkDelivered(selected)}
                  data-ocid="pending.mark_delivered.button"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Delivered
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
