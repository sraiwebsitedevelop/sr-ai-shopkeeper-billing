import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, MessageCircle, Printer } from "lucide-react";
import type { Order } from "../types";
import { getProfile } from "../utils/storage";

interface InvoiceViewProps {
  order: Order;
}

export default function InvoiceView({ order }: InvoiceViewProps) {
  const profile = getProfile();

  function buildWhatsAppMessage() {
    const itemLines = order.items
      .map(
        (it) =>
          `  \u2022 ${it.productName} - \u20b9${it.price} (Disc: \u20b9${it.discount}) = \u20b9${it.itemTotal}`,
      )
      .join("\n");
    const deliveryLine = order.deliveryDate
      ? `\n\ud83d\udce6 Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString("en-IN")}`
      : "";
    return encodeURIComponent(
      `\ud83c\udfea *${profile.shopName}*\n\ud83d\udcde ${profile.mobileNumber}\n\n\ud83d\udc64 Customer: ${order.customerName}\n\ud83d\udccd Address: ${order.customerAddress}\n\ud83d\udcc5 Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}${deliveryLine}\n\n\ud83d\udecd\ufe0f Order Details:\n${itemLines}\n\n\ud83d\udcb0 Summary:\nTotal: \u20b9${order.total}\nDiscount: \u20b9${order.discountAmount}\nGrand Total: \u20b9${order.grandTotal}\nAdvance: \u20b9${order.advance}\nDues: \u20b9${order.dues}\nNet Total: \u20b9${order.netTotal}\nPayment: ${order.transactionType}\n\n\ud83d\ude4f Thank you for your business!`,
    );
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order.id.slice(-8).toUpperCase()}</title>
          <meta charset="UTF-8" />
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: sans-serif; color: #111; background: #fff; }
            .invoice-wrap { max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
            .invoice-header { background: #2d5be3; padding: 20px; text-align: center; color: white; }
            .invoice-header img { display: block; width: 120px; height: auto; max-height: 80px; object-fit: contain; margin: 0 auto 12px auto; }
            .invoice-header h2 { font-size: 18px; font-weight: 700; }
            .invoice-header p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
            .invoice-meta { display: flex; justify-content: space-between; padding: 12px 20px; background: #f3f4f6; }
            .invoice-meta .label { font-size: 11px; color: #6b7280; }
            .invoice-meta .value { font-size: 13px; font-weight: 600; }
            .invoice-body { padding: 20px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
            .customer-name { font-weight: 600; font-size: 14px; }
            .customer-detail { font-size: 13px; color: #6b7280; margin-top: 2px; }
            hr { border: none; border-top: 1px solid #e5e7eb; margin: 14px 0; }
            .items-header { display: grid; grid-template-columns: 2fr 1fr 1fr; font-size: 11px; color: #6b7280; font-weight: 600; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
            .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
            .item-name { font-weight: 500; }
            .item-price { font-size: 11px; color: #6b7280; }
            .text-right { text-align: right; }
            .summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
            .summary-row.bold { font-weight: 700; }
            .summary-row.destructive { color: #dc2626; }
            .thank-you { text-align: center; font-size: 12px; color: #6b7280; margin-top: 14px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="invoice-wrap">
            <div class="invoice-header">
              <img src="${profile.logoBase64 || "/assets/uploads/IMG_20260312_142012-1.jpg"}" alt="Logo" />
              <h2>${profile.shopName || "SR.AI Website Developer"}</h2>
              ${profile.mobileNumber ? `<p>&#x1F4DE; ${profile.mobileNumber}</p>` : ""}
            </div>
            <div class="invoice-meta">
              <div>
                <div class="label">INVOICE</div>
                <div class="value">#${order.id.slice(-8).toUpperCase()}</div>
              </div>
              <div style="text-align:right">
                <div class="label">Order Date</div>
                <div class="value">${new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
              </div>
            </div>
            ${
              order.deliveryDate
                ? `
            <div class="invoice-meta" style="justify-content:flex-end">
              <div style="text-align:right">
                <div class="label">Delivery Date</div>
                <div class="value">${new Date(order.deliveryDate).toLocaleDateString("en-IN")}</div>
              </div>
            </div>`
                : ""
            }
            <div class="invoice-body">
              <div class="section-title">Bill To</div>
              <div class="customer-name">${order.customerName}</div>
              <div class="customer-detail">${order.customerMobile}</div>
              ${order.customerAddress ? `<div class="customer-detail">${order.customerAddress}</div>` : ""}
              <hr />
              <div class="section-title">Items</div>
              <div class="items-header">
                <span>Product</span>
                <span class="text-right">Disc</span>
                <span class="text-right">Total</span>
              </div>
              ${order.items
                .map(
                  (item) => `
              <div class="item-row">
                <div>
                  <div class="item-name">${item.productName}</div>
                  <div class="item-price">&#x20b9;${item.price}</div>
                </div>
                <div class="text-right">&#x20b9;${item.discount}</div>
                <div class="text-right" style="font-weight:500">&#x20b9;${item.itemTotal}</div>
              </div>`,
                )
                .join("")}
              <hr />
              <div class="summary-row"><span style="color:#6b7280">Total</span><span>&#x20b9;${order.total}</span></div>
              <div class="summary-row"><span style="color:#6b7280">Discount</span><span>&#x20b9;${order.discountAmount}</span></div>
              <div class="summary-row bold"><span>Grand Total</span><span>&#x20b9;${order.grandTotal}</span></div>
              <hr />
              <div class="summary-row"><span style="color:#6b7280">Advance</span><span>&#x20b9;${order.advance}</span></div>
              <div class="summary-row destructive"><span>Dues</span><span>&#x20b9;${order.dues}</span></div>
              <div class="summary-row bold"><span>Net Total</span><span>&#x20b9;${order.netTotal}</span></div>
              <div class="summary-row"><span style="color:#6b7280">Payment Mode</span><span style="font-weight:500">${order.transactionType}</span></div>
              <div class="thank-you">&#x1F64F; Thank you for your business!</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  const logoSrc =
    profile.logoBase64 && profile.logoBase64 !== ""
      ? profile.logoBase64
      : "/assets/uploads/IMG_20260312_142012-1.jpg";

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Controls */}
      <div className="flex gap-3 mb-6 no-print">
        <Button
          type="button"
          className="flex-1 gap-2 gradient-brand text-white border-0"
          onClick={handlePrint}
          data-ocid="invoice.download.button"
        >
          <Download className="h-4 w-4" />
          Download / Print PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => {
            const mobile = order.customerMobile.replace(/\D/g, "");
            window.open(
              `https://wa.me/${mobile}?text=${buildWhatsAppMessage()}`,
              "_blank",
            );
          }}
          data-ocid="invoice.whatsapp.button"
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
          Send WhatsApp
        </Button>
      </div>

      {/* Invoice Preview */}
      <div className="border border-border rounded-2xl overflow-hidden print:border-0 print:rounded-none">
        {/* Header */}
        <div
          className="p-5 text-center"
          style={{ background: "oklch(0.42 0.2 255)" }}
        >
          <div className="flex justify-center mb-3">
            <img
              src={logoSrc}
              alt="Logo"
              className="w-32 h-auto max-h-24 object-contain"
            />
          </div>
          <h2 className="font-display font-bold text-white text-xl">
            {profile.shopName || "SR.AI Website Developer"}
          </h2>
          {profile.mobileNumber && (
            <p className="text-white/80 text-sm mt-1">
              &#x1F4DE; {profile.mobileNumber}
            </p>
          )}
        </div>

        {/* Invoice Label */}
        <div className="px-5 py-3 flex justify-between items-center bg-secondary">
          <div>
            <p className="text-xs text-muted-foreground">INVOICE</p>
            <p className="font-semibold text-sm">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Order Date</p>
            <p className="font-semibold text-sm">
              {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Delivery Date row */}
        {order.deliveryDate && (
          <div className="px-5 py-2 bg-secondary/50 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Delivery Date</p>
              <p className="font-semibold text-sm">
                {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Bill To
            </p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {order.customerMobile}
            </p>
            {order.customerAddress && (
              <p className="text-sm text-muted-foreground">
                {order.customerAddress}
              </p>
            )}
          </div>

          <Separator />

          {/* Products Table */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              Items
            </p>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-1 border-b">
                <span className="col-span-2">Product</span>
                <span className="text-right">Disc</span>
                <span className="text-right">Total</span>
              </div>
              {order.items.map((item, i) => (
                <div
                  key={`${item.productName}-${i}`}
                  className="grid grid-cols-4 text-sm py-1"
                >
                  <div className="col-span-2">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      &#x20b9;{item.price}
                    </p>
                  </div>
                  <span className="text-right text-muted-foreground">
                    &#x20b9;{item.discount}
                  </span>
                  <span className="text-right font-medium">
                    &#x20b9;{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription (if present) */}
          {order.prescription && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                  Power Prescription
                </p>
                <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground mb-1">
                  <span>Eye</span>
                  <span className="text-center">Sph</span>
                  <span className="text-center">Cyl</span>
                  <span className="text-center">Axis</span>
                  <span className="text-center">Near</span>
                </div>
                <div className="grid grid-cols-5 text-xs py-1.5 border-t">
                  <span className="font-medium">Right</span>
                  <span className="text-center">
                    {order.prescription.rightSph || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.rightCyl || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.rightAxis || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.rightNear || "\u2014"}
                  </span>
                </div>
                <div className="grid grid-cols-5 text-xs py-1.5 border-t">
                  <span className="font-medium">Left</span>
                  <span className="text-center">
                    {order.prescription.leftSph || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.leftCyl || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.leftAxis || "\u2014"}
                  </span>
                  <span className="text-center">
                    {order.prescription.leftNear || "\u2014"}
                  </span>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span>&#x20b9;{order.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>&#x20b9;{order.discountAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Grand Total</span>
              <span>&#x20b9;{order.grandTotal}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Advance</span>
              <span>&#x20b9;{order.advance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dues</span>
              <span className="text-destructive">&#x20b9;{order.dues}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Net Total</span>
              <span>&#x20b9;{order.netTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Mode</span>
              <span className="font-medium">{order.transactionType}</span>
            </div>
          </div>

          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            &#x1F64F; Thank you for your business!
          </p>
        </div>
      </div>

      {/* Print helper note */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        <Printer className="inline h-3 w-3 mr-1" />
        Click "Download / Print PDF" &rarr; Save as PDF in browser print dialog
      </p>
    </div>
  );
}
