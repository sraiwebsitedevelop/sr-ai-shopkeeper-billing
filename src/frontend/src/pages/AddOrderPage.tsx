import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  ChevronRight,
  Eye,
  Image,
  MessageCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppHeader from "../components/AppHeader";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Order, OrderItem, Prescription } from "../types";
import { generateId, getProfile, saveOrder } from "../utils/storage";

type Step = 1 | 2;

type OrderItemWithId = OrderItem & { _id: string };

function emptyItem(): OrderItemWithId {
  return {
    _id: Math.random().toString(36).slice(2),
    productName: "",
    photoBase64: "",
    price: 0,
    discount: 0,
    itemTotal: 0,
  };
}

const emptyPrescription = (): Prescription => ({
  photoBase64: "",
  rightSph: "",
  rightCyl: "",
  rightAxis: "",
  rightNear: "",
  leftSph: "",
  leftCyl: "",
  leftAxis: "",
  leftNear: "",
});

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddOrderPage() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const [step, setStep] = useState<Step>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [items, setItems] = useState<OrderItemWithId[]>([emptyItem()]);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescription, setPrescription] = useState<Prescription>(
    emptyPrescription(),
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [transactionType, setTransactionType] = useState("Cash");
  const prescriptionGalleryRef = useRef<HTMLInputElement>(null);
  const prescriptionCameraRef = useRef<HTMLInputElement>(null);

  const itemsTotal = items.reduce((sum, it) => sum + it.itemTotal, 0);
  const grandTotal = Math.max(0, itemsTotal - discountAmount);
  const dues = Math.max(0, grandTotal - advance);
  const netTotal = grandTotal;

  const itemGalleryRefs = useRef<(HTMLInputElement | null)[]>([]);
  const itemCameraRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: "/" });
    }
  }, [identity, isInitializing, navigate]);

  function updateItem(
    idx: number,
    field: keyof OrderItem,
    value: string | number,
  ) {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      if (field === "price" || field === "discount") {
        const price = field === "price" ? Number(value) : item.price;
        const discount = field === "discount" ? Number(value) : item.discount;
        item.itemTotal = Math.max(0, price - discount);
      }
      next[idx] = item;
      return next;
    });
  }

  async function handleItemPhoto(idx: number, file: File | null) {
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateItem(idx, "photoBase64", base64);
  }

  async function handlePrescriptionPhoto(file: File | null) {
    if (!file) return;
    const base64 = await fileToBase64(file);
    setPrescription((p) => ({ ...p, photoBase64: base64 }));
  }

  function validateStep1() {
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return false;
    }
    if (!customerMobile.trim()) {
      toast.error("Customer mobile is required");
      return false;
    }
    if (items.some((it) => !it.productName.trim())) {
      toast.error("All product names are required");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo(0, 0);
  }

  function buildOrder(): Order {
    return {
      id: generateId(),
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      customerAddress: customerAddress.trim(),
      items: items.map(({ _id: _unused, ...rest }) => rest),
      prescription: showPrescription ? prescription : undefined,
      total: itemsTotal,
      discountAmount,
      grandTotal,
      advance,
      dues,
      netTotal,
      transactionType,
      status: "pending",
      createdAt: Date.now(),
      deliveryDate: deliveryDate || undefined,
    };
  }

  function buildWhatsAppMessage(
    order: Order,
    profile: ReturnType<typeof getProfile>,
  ) {
    const itemLines = order.items
      .map(
        (it) =>
          `  \u2022 ${it.productName} - Price: \u20b9${it.price} Discount: \u20b9${it.discount} Total: \u20b9${it.itemTotal}`,
      )
      .join("\n");
    const deliveryLine = order.deliveryDate
      ? `\n\ud83d\udce6 Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString("en-IN")}`
      : "";
    return encodeURIComponent(
      `\ud83c\udfea *${profile.shopName}*\n\ud83d\udcde ${profile.mobileNumber}\n\n\ud83d\udc64 Customer: ${order.customerName}\n\ud83d\udccd Address: ${order.customerAddress}\n\ud83d\udcc5 Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}${deliveryLine}\n\n\ud83d\udecd\ufe0f Order Details:\n${itemLines}\n\n\ud83d\udcb0 Summary:\nTotal: \u20b9${order.total}\nDiscount: \u20b9${order.discountAmount}\nGrand Total: \u20b9${order.grandTotal}\nAdvance: \u20b9${order.advance}\nDues: \u20b9${order.dues}\nNet Total: \u20b9${order.netTotal}\nPayment: ${order.transactionType}\n\n\ud83d\ude4f Thank you for your business!`,
    );
  }

  function handleSubmit() {
    try {
      const order = buildOrder();
      saveOrder(order);
      toast.success("Order saved successfully!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Failed to save order. Please try again.");
      console.error(err);
    }
  }

  function handleSendWhatsApp() {
    const order = buildOrder();
    const profile = getProfile();
    const msg = buildWhatsAppMessage(order, profile);
    const mobile = customerMobile.replace(/\D/g, "");
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title={step === 1 ? "New Order - Step 1" : "New Order - Step 2"}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-24">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <Badge
            variant={step === 1 ? "default" : "secondary"}
            className="px-3"
          >
            1 Customer &amp; Products
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Badge
            variant={step === 2 ? "default" : "secondary"}
            className="px-3"
          >
            2 Payment Summary
          </Badge>
        </div>

        {step === 1 && (
          <>
            {/* Customer Info */}
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cname">Customer Name *</Label>
                  <Input
                    id="cname"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full name"
                    data-ocid="order.customer_name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cmobile">Mobile Number *</Label>
                  <Input
                    id="cmobile"
                    type="tel"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    data-ocid="order.mobile.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="caddress">Address</Label>
                  <Textarea
                    id="caddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Customer address"
                    rows={2}
                    data-ocid="order.address.textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="order-date">Date of Order</Label>
                    <Input
                      id="order-date"
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      readOnly
                      className="bg-muted cursor-default"
                      data-ocid="order.order_date.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="delivery-date">Date of Delivery</Label>
                    <Input
                      id="delivery-date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      data-ocid="order.delivery_date.input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {items.map((item, idx) => (
                  <div
                    key={item._id}
                    className="space-y-3"
                    data-ocid={`order.product.item.${idx + 1}`}
                  >
                    {idx > 0 && <Separator />}
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Product {idx + 1}
                      </p>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setItems((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          data-ocid={`order.product.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Product Name *</Label>
                      <Input
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(idx, "productName", e.target.value)
                        }
                        placeholder="e.g. Progressive Lens"
                        data-ocid="order.product.name.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Product Photo</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-3">
                        {item.photoBase64 && (
                          <img
                            src={item.photoBase64}
                            alt="product"
                            className="h-20 mx-auto object-contain rounded mb-3"
                          />
                        )}
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() =>
                              itemGalleryRefs.current[idx]?.click()
                            }
                            data-ocid="order.product.upload_button"
                          >
                            <Image className="h-3.5 w-3.5" />
                            Gallery
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => itemCameraRefs.current[idx]?.click()}
                            data-ocid="order.product.camera.upload_button"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            Camera
                          </Button>
                        </div>
                      </div>
                      <input
                        ref={(el) => {
                          itemGalleryRefs.current[idx] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleItemPhoto(idx, e.target.files?.[0] ?? null)
                        }
                      />
                      <input
                        ref={(el) => {
                          itemCameraRefs.current[idx] = el;
                        }}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) =>
                          handleItemPhoto(idx, e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>Price (&#x20b9;)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.price || ""}
                          onChange={(e) =>
                            updateItem(idx, "price", Number(e.target.value))
                          }
                          placeholder="0"
                          data-ocid="order.product.price.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Discount (&#x20b9;)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.discount || ""}
                          onChange={(e) =>
                            updateItem(idx, "discount", Number(e.target.value))
                          }
                          placeholder="0"
                          data-ocid="order.product.discount.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Total (&#x20b9;)</Label>
                        <Input
                          readOnly
                          value={item.itemTotal}
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                  data-ocid="order.add_product.button"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Another Product
                </Button>
              </CardContent>
            </Card>

            {/* Power Prescription */}
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Power Prescription
                  </CardTitle>
                  <Switch
                    checked={showPrescription}
                    onCheckedChange={setShowPrescription}
                    data-ocid="order.prescription.toggle"
                  />
                </div>
              </CardHeader>
              {showPrescription && (
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Prescription Photo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-3">
                      {prescription.photoBase64 && (
                        <img
                          src={prescription.photoBase64}
                          alt="prescription"
                          className="h-20 mx-auto object-contain rounded mb-3"
                        />
                      )}
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() =>
                            prescriptionGalleryRef.current?.click()
                          }
                          data-ocid="order.prescription.upload_button"
                        >
                          <Image className="h-3.5 w-3.5" />
                          Gallery
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => prescriptionCameraRef.current?.click()}
                          data-ocid="order.prescription.camera.upload_button"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Camera
                        </Button>
                      </div>
                    </div>
                    <input
                      ref={prescriptionGalleryRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handlePrescriptionPhoto(e.target.files?.[0] ?? null)
                      }
                    />
                    <input
                      ref={prescriptionCameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) =>
                        handlePrescriptionPhoto(e.target.files?.[0] ?? null)
                      }
                    />
                  </div>

                  {/* Right Eye */}
                  <div>
                    <p className="text-sm font-semibold mb-2">
                      &#x1F441;&#xFE0F; Right Eye
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          "rightSph",
                          "rightCyl",
                          "rightAxis",
                          "rightNear",
                        ] as const
                      ).map((field) => (
                        <div key={field} className="space-y-1">
                          <Label className="text-xs">
                            {field === "rightSph"
                              ? "Sph"
                              : field === "rightCyl"
                                ? "Cyl"
                                : field === "rightAxis"
                                  ? "Axis"
                                  : "Near Vision"}
                          </Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={prescription[field]}
                            onChange={(e) =>
                              setPrescription((p) => ({
                                ...p,
                                [field]: e.target.value,
                              }))
                            }
                            placeholder="0"
                            className="text-sm"
                            data-ocid={`order.rx.${field}.input`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Left Eye */}
                  <div>
                    <p className="text-sm font-semibold mb-2">
                      &#x1F441;&#xFE0F; Left Eye
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        ["leftSph", "leftCyl", "leftAxis", "leftNear"] as const
                      ).map((field) => (
                        <div key={field} className="space-y-1">
                          <Label className="text-xs">
                            {field === "leftSph"
                              ? "Sph"
                              : field === "leftCyl"
                                ? "Cyl"
                                : field === "leftAxis"
                                  ? "Axis"
                                  : "Near Vision"}
                          </Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={prescription[field]}
                            onChange={(e) =>
                              setPrescription((p) => ({
                                ...p,
                                [field]: e.target.value,
                              }))
                            }
                            placeholder="0"
                            className="text-sm"
                            data-ocid={`order.rx.${field}.input`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Next Button */}
            <Button
              type="button"
              className="w-full h-12 text-base font-semibold gradient-brand text-white border-0 shadow-card"
              onClick={handleNext}
              data-ocid="order.next.button"
            >
              Next &mdash; Payment Summary
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Payment Summary */}
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="space-y-2 p-3 rounded-xl"
                  style={{ background: "oklch(0.95 0.04 255 / 0.3)" }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Total</span>
                    <span className="font-medium">&#x20b9;{itemsTotal}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="overall-discount">
                    Overall Discount (&#x20b9;)
                  </Label>
                  <Input
                    id="overall-discount"
                    type="number"
                    min="0"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    placeholder="0"
                    data-ocid="order.discount.input"
                  />
                </div>

                <div
                  className="p-3 rounded-xl border border-primary/20"
                  style={{ background: "oklch(0.95 0.06 255 / 0.2)" }}
                >
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Grand Total</span>
                    <span style={{ color: "oklch(0.45 0.18 255)" }}>
                      &#x20b9;{grandTotal}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="advance">Advance (&#x20b9;)</Label>
                  <Input
                    id="advance"
                    type="number"
                    min="0"
                    value={advance || ""}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                    placeholder="0"
                    data-ocid="order.advance.input"
                  />
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-muted">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dues</span>
                    <span className="font-medium text-destructive">
                      &#x20b9;{dues}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Net Total</span>
                    <span>&#x20b9;{netTotal}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Transaction Type</Label>
                  <Select
                    value={transactionType}
                    onValueChange={setTransactionType}
                  >
                    <SelectTrigger data-ocid="order.transaction.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                className="w-full h-12 text-base font-semibold gradient-brand text-white border-0 shadow-card"
                onClick={handleSubmit}
                data-ocid="order.submit.button"
              >
                Submit Order
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base gap-2"
                onClick={handleSendWhatsApp}
                data-ocid="order.whatsapp.button"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                Send WhatsApp
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
                data-ocid="order.back.button"
              >
                &larr; Back to Step 1
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
