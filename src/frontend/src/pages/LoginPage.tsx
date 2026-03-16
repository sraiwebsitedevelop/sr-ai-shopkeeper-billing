import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint, Loader2, LogIn, Shield, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const STEPS = [
  {
    icon: <LogIn className="h-4 w-4" />,
    text: "Login button dabayein",
  },
  {
    icon: <Smartphone className="h-4 w-4" />,
    text: 'Ek naya tab khulega - wahan "Create New" ya "Use Existing" choose karein',
  },
  {
    icon: <Fingerprint className="h-4 w-4" />,
    text: "Apne phone ka fingerprint/Face ID ya PIN use karein",
  },
];

export default function LoginPage() {
  const {
    login,
    isLoggingIn,
    isLoginSuccess,
    isInitializing,
    identity,
    isLoginError,
    loginError,
  } = useInternetIdentity();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  // Redirect to dashboard if already authenticated or just logged in
  useEffect(() => {
    if (!isInitializing && identity) {
      navigate({ to: "/dashboard" });
    }
  }, [isInitializing, identity, navigate]);

  useEffect(() => {
    if (isLoginSuccess && identity) {
      navigate({ to: "/dashboard" });
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 260) 0%, oklch(0.22 0.08 255) 40%, oklch(0.15 0.05 270) 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.22 255), transparent)",
          }}
        />
        <div
          className="absolute bottom-[-100px] right-[-60px] w-96 h-96 rounded-full opacity-15 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, oklch(0.6 0.2 250), transparent)",
            animationDelay: "1s",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="relative flex flex-col items-center">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-60"
            style={{
              background: "oklch(0.55 0.22 255)",
              transform: "scale(1.3)",
            }}
          />
          <div
            className="relative rounded-full p-1.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 255), oklch(0.45 0.18 250))",
              boxShadow:
                "0 0 40px oklch(0.55 0.22 255 / 0.7), 0 0 80px oklch(0.45 0.18 255 / 0.4)",
            }}
          >
            <img
              src="/assets/uploads/IMG_20260312_142012-1.jpg"
              alt="SR.AI Logo"
              className="w-32 h-32 rounded-full object-cover block"
              style={{ border: "3px solid rgba(255,255,255,0.15)" }}
            />
          </div>
        </div>

        {/* App name */}
        <div className="text-center space-y-1">
          <h1
            className="font-display text-4xl font-extrabold tracking-tight"
            style={{
              color: "white",
              textShadow: "0 2px 20px oklch(0.55 0.22 255 / 0.8)",
            }}
          >
            SR<span style={{ color: "oklch(0.72 0.22 255)" }}>.AI</span>
          </h1>
          <p
            className="font-display text-lg font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.22 255)" }}
          >
            Website Developer
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.75 0.06 255)" }}>
            Apka Khud Ka Bill Site
          </p>
        </div>

        {/* Login card */}
        <div
          className="w-full rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: "oklch(1 0 0 / 0.07)",
            border: "1px solid oklch(1 0 0 / 0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "white" }}>
              Shopkeeper Login
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.7 0.06 255)" }}
            >
              Neeche button dabayein aur apne device se login karein
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {STEPS.map((step, i) => (
              <div key={step.text} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white mt-0.5"
                  style={{ background: "oklch(0.5 0.2 255 / 0.7)" }}
                >
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span style={{ color: "oklch(0.72 0.22 255)" }}>
                    {step.icon}
                  </span>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.78 0.06 255)" }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isLoginError &&
            loginError &&
            loginError.message !== "User is already authenticated" && (
              <div
                className="rounded-lg px-3 py-2 text-xs"
                style={{
                  background: "oklch(0.35 0.15 25 / 0.3)",
                  color: "oklch(0.85 0.1 25)",
                }}
                data-ocid="login.error_state"
              >
                Error: {loginError.message}. Dobara try karein.
              </div>
            )}

          <Button
            className="w-full h-12 text-base font-bold rounded-xl border-0 transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 250))",
              color: "white",
              boxShadow: "0 4px 20px oklch(0.45 0.20 255 / 0.5)",
            }}
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Login ho raha
                hai...
              </>
            ) : isInitializing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> App load ho rahi
                hai...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" /> Login Karein
              </>
            )}
          </Button>

          <div
            className="flex items-center justify-center gap-3 text-xs"
            style={{ color: "oklch(0.6 0.05 255)" }}
          >
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Secure Login
            </span>
            <span>•</span>
            <span>30 din tak active rahega</span>
          </div>
        </div>

        {/* Help toggle */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="text-xs underline"
          style={{ color: "oklch(0.6 0.1 255)" }}
          data-ocid="login.toggle"
        >
          {showGuide
            ? "Guide band karein"
            : "Login mein problem? Yahan click karein"}
        </button>

        {showGuide && (
          <div
            className="w-full rounded-xl p-4 text-xs flex flex-col gap-2"
            style={{
              background: "oklch(1 0 0 / 0.05)",
              border: "1px solid oklch(1 0 0 / 0.1)",
              color: "oklch(0.78 0.06 255)",
            }}
          >
            <p className="font-semibold" style={{ color: "white" }}>
              Pehli baar login kar rahe hain?
            </p>
            <p>1. Login button dabayein - ek naya tab khulega</p>
            <p>2. "Create New" select karein</p>
            <p>
              3. Apna phone ya computer ka lock screen use karein
              (fingerprint/PIN)
            </p>
            <p>
              4. Ek Anchor Number milega - use save kar lein (yahi aapka login
              ID hai)
            </p>
            <p className="font-semibold mt-1" style={{ color: "white" }}>
              Dobara login kar rahe hain?
            </p>
            <p>Login button dabayein aur same device/fingerprint use karein</p>
            <p className="mt-1" style={{ color: "oklch(0.65 0.1 60)" }}>
              Agar popup block ho to browser mein popup allow karein
            </p>
          </div>
        )}

        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.5 0.05 255)" }}
        >
          &copy; {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
