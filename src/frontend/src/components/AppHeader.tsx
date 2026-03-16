import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onSettings?: () => void;
}

export default function AppHeader({
  title,
  showBack = true,
  onSettings,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/dashboard" })}
            className="shrink-0"
            data-ocid="nav.link"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src="/assets/uploads/IMG_20260312_142012-1.jpg"
            alt="SR.AI Logo"
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <h1 className="font-display font-bold text-foreground truncate text-base">
            {title}
          </h1>
        </div>
        {onSettings && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettings}
            className="shrink-0"
            data-ocid="nav.button"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
