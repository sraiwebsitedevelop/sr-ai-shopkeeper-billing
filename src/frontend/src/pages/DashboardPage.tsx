import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle2,
  Clock,
  Image,
  LogOut,
  PlusCircle,
  ReceiptText,
  Store,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppHeader from "../components/AppHeader";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { ShopProfile } from "../types";
import { getOrders, getProfile, saveProfile } from "../utils/storage";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { clear, identity, isInitializing } = useInternetIdentity();
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState<ShopProfile>(getProfile());
  const [profileDraft, setProfileDraft] = useState<ShopProfile>(getProfile());
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const orders = getOrders();
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: "/" });
    }
  }, [identity, isInitializing, navigate]);

  function handleSaveProfile() {
    saveProfile(profileDraft);
    setProfile(profileDraft);
    setShowSettings(false);
    toast.success("Profile saved successfully");
  }

  async function handleLogoFile(file: File | null) {
    if (!file) return;
    const base64 = await fileToBase64(file);
    setProfileDraft((p) => ({ ...p, logoBase64: base64 }));
  }

  const cards = [
    {
      title: "Add New Order",
      icon: PlusCircle,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      count: null,
      route: "/add-order",
      ocid: "dashboard.add_order.card",
    },
    {
      title: "Total Order Bills",
      icon: ReceiptText,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      count: totalCount,
      route: "/orders",
      ocid: "dashboard.total_orders.card",
    },
    {
      title: "Pending Bills",
      icon: Clock,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      count: pendingCount,
      route: "/pending",
      ocid: "dashboard.pending.card",
    },
    {
      title: "Delivered",
      icon: CheckCircle2,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      count: deliveredCount,
      route: "/delivered",
      ocid: "dashboard.delivered.card",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="SR.AI Website Developer"
        showBack={false}
        onSettings={() => {
          setProfileDraft(getProfile());
          setShowSettings(true);
        }}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: "oklch(0.93 0.06 255 / 0.3)" }}
          >
            <div className="flex-shrink-0">
              {profile.logoBase64 ? (
                <img
                  src={profile.logoBase64}
                  alt="Shop Logo"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                />
              ) : (
                <div
                  className="p-2 rounded-xl"
                  style={{ background: "oklch(0.45 0.18 255 / 0.15)" }}
                >
                  <Store
                    className="h-5 w-5"
                    style={{ color: "oklch(0.45 0.18 255)" }}
                  />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {profile.shopName || "SR.AI Website Developer"}
              </p>
              {profile.mobileNumber && (
                <p className="text-xs text-muted-foreground">
                  {profile.mobileNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => (
            <button
              type="button"
              key={card.route}
              onClick={() => navigate({ to: card.route as "/" })}
              data-ocid={card.ocid}
              className="group text-left"
            >
              <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-border/60">
                <CardContent className="p-5">
                  <div className={`inline-flex p-3 rounded-xl ${card.bg} mb-4`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm leading-tight">
                      {card.title}
                    </p>
                    {card.count !== null && (
                      <p
                        className="text-2xl font-bold mt-1"
                        style={{ color: "oklch(0.45 0.18 255)" }}
                      >
                        {card.count}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              clear();
              navigate({ to: "/" });
            }}
            className="text-muted-foreground hover:text-foreground gap-2"
            data-ocid="dashboard.logout.button"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </main>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent data-ocid="settings.dialog">
          <DialogHeader>
            <DialogTitle>Shopkeeper Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Shop Logo</Label>
              <div className="flex items-center gap-4">
                {profileDraft.logoBase64 ? (
                  <img
                    src={profileDraft.logoBase64}
                    alt="Shop Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    <Store className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => galleryRef.current?.click()}
                    data-ocid="settings.logo.upload_button"
                  >
                    <Image className="h-3.5 w-3.5" />
                    Gallery
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => cameraRef.current?.click()}
                    data-ocid="settings.logo.upload_button"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Camera
                  </Button>
                </div>
              </div>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoFile(e.target.files?.[0] ?? null)}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={profileDraft.shopName}
                onChange={(e) =>
                  setProfileDraft((p) => ({ ...p, shopName: e.target.value }))
                }
                placeholder="Your shop name"
                data-ocid="settings.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={profileDraft.mobileNumber}
                onChange={(e) =>
                  setProfileDraft((p) => ({
                    ...p,
                    mobileNumber: e.target.value,
                  }))
                }
                placeholder="+91 XXXXXXXXXX"
                data-ocid="settings.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettings(false)}
              data-ocid="settings.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              data-ocid="settings.save_button"
            >
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
