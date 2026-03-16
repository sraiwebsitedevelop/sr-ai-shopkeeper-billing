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
  FileText,
  MessageCircle,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import AppHeader from "../components/AppHeader";
import InvoiceView from "../components/InvoiceView";
import type { Order } from "../types";
import { getOrders, getProfile } from "../utils/storage";

export default function DeliveredPage() {
  const [orders] = useState(() =>
    getOrders().filter((o) => o.status === "delivered"),
  );
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  function buildWhatsAppMessage(order: Order) {
    const profile = getProfile();
    const itemLines = order.items
      .map(
        (it) =>
          `  • ${it.productName} - ₹${it.price} (Disc: ₹${it.discount}) = ₹${it.itemTotal}`,
      )
      .join("\n");
    const deliveryLine = order.deliveryDate
      ? `\n📦 Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString("en-IN")}`
      : "";
    return encodeURIComponent(
      `🏪 *${profile.shopName}*
📞 ${profile.mobileNumber}

👤 Customer: ${order.customerName}
📍 Address: ${order.customerAddress}
📅 Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}${deliveryLine}

🛍️ Order Details:
${itemLines}

💰 Summary:
Total: ₹${order.total}
Discount: ₹${order.discountAmount}
Grand Total: ₹${order.grandTotal}
Advance: ₹${order.advance}
Dues: ₹${order.dues}
Net Total: ₹${order.netTotal}
Payment: ${order.transactionType}

🙏 Thank you for your business!`,
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Delivered Orders" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16" data-ocid="delivered.empty_state">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No delivered orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <Card
                key={order.id}
                className="shadow-card border-border/60"
                data-ocid={`delivered.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">
                        {order.customerName}
                      </span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Delivered
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
                      ₹{order.grandTotal}
                    </span>
                  </div>
                  {order.deliveryDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Truck className="h-3 w-3" />
                      Delivery:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setInvoiceOrder(order)}
                      data-ocid={`delivered.invoice.button.${i + 1}`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Generate Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const mobile = order.customerMobile.replace(/\D/g, "");
                        const msg = buildWhatsAppMessage(order);
                        window.open(
                          `https://wa.me/${mobile}?text=${msg}`,
                          "_blank",
                        );
                      }}
                      data-ocid={`delivered.whatsapp.button.${i + 1}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-green-600" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Invoice Sheet */}
      <Sheet
        open={!!invoiceOrder}
        onOpenChange={(open) => !open && setInvoiceOrder(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[95vh] overflow-y-auto p-0"
          data-ocid="delivered.invoice.sheet"
        >
          <SheetHeader className="p-4 pb-2 no-print">
            <SheetTitle>Invoice</SheetTitle>
          </SheetHeader>
          {invoiceOrder && <InvoiceView order={invoiceOrder} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
