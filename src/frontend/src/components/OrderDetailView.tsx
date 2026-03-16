import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, User, X } from "lucide-react";
import { useState } from "react";
import type { Order } from "../types";

function ImageLightbox({
  src,
  alt,
  onClose,
}: { src: string; alt: string; onClose: () => void }) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: overlay close on click
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      data-ocid="image.lightbox.modal"
    >
      <button
        type="button"
        className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2"
        onClick={onClose}
        data-ocid="image.lightbox.close_button"
      >
        <X className="h-5 w-5" />
      </button>
      {/* A4 aspect ratio: 210x297mm = ~1:1.414 */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation container */}
      <div
        className="bg-white rounded-lg overflow-hidden shadow-2xl"
        style={{ width: "min(90vw, 210mm)", aspectRatio: "210/297" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export default function OrderDetailView({ order }: { order: Order }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  function openLightbox(src: string, alt: string) {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  }

  function closeLightbox() {
    setLightboxSrc(null);
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Image Lightbox */}
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt={lightboxAlt}
          onClose={closeLightbox}
        />
      )}

      {/* Customer Info */}
      <section>
        <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Customer
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{order.customerMobile}</span>
          </div>
          {order.customerAddress && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{order.customerAddress}</span>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* Products */}
      <section>
        <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Products
        </h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={`${item.productName}-${i}`}
              className="flex gap-3 p-3 rounded-xl bg-secondary/50"
            >
              {item.photoBase64 && (
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(item.photoBase64!, item.productName)
                  }
                  className="flex-shrink-0 focus:outline-none"
                  data-ocid="product.image.button"
                  title="Tap to view full size"
                >
                  <img
                    src={item.photoBase64}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-primary/40"
                  />
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.productName}</p>
                <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                  <p>
                    Price: &#x20b9;{item.price} | Discount: &#x20b9;
                    {item.discount}
                  </p>
                  <p
                    className="font-medium"
                    style={{ color: "oklch(0.45 0.18 255)" }}
                  >
                    Total: &#x20b9;{item.itemTotal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prescription */}
      {order.prescription && (
        <>
          <Separator />
          <section>
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Power Prescription
            </h3>
            {order.prescription.photoBase64 && (
              <button
                type="button"
                onClick={() =>
                  openLightbox(order.prescription!.photoBase64!, "Prescription")
                }
                className="w-full focus:outline-none"
                data-ocid="prescription.image.button"
                title="Tap to view full size"
              >
                <img
                  src={order.prescription.photoBase64}
                  alt="prescription"
                  className="w-full max-h-40 object-contain rounded-xl mb-3 bg-muted cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-primary/40"
                />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs font-semibold mb-2">Right Eye</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sph</span>
                    <span>{order.prescription.rightSph || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cyl</span>
                    <span>{order.prescription.rightCyl || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Axis</span>
                    <span>{order.prescription.rightAxis || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Near</span>
                    <span>{order.prescription.rightNear || "—"}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs font-semibold mb-2">Left Eye</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sph</span>
                    <span>{order.prescription.leftSph || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cyl</span>
                    <span>{order.prescription.leftCyl || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Axis</span>
                    <span>{order.prescription.leftAxis || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Near</span>
                    <span>{order.prescription.leftNear || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Separator />

      {/* Payment */}
      <section>
        <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Payment
        </h3>
        <div className="space-y-2 p-4 rounded-xl bg-secondary/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span>&#x20b9;{order.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span>&#x20b9;{order.discountAmount}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
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
          <div className="flex justify-between text-sm font-semibold">
            <span>Net Total</span>
            <span>&#x20b9;{order.netTotal}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction</span>
            <Badge variant="outline">{order.transactionType}</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
