import { ArrowDownRight, ArrowUpRight, MapPin, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePrediction } from "@/hooks/usePrediction";
import { DriverCards } from "./DriverCards";

interface PrepItem {
  id: string;
  name: string;
  category: string;
  baseline_qty: number;
  predicted_qty: number;
  ratio: number;
  pct_change: number;
}

interface LgbmPrep {
  predicted_covers: number;
  baseline_covers: number;
  lift_pct: number;
  items: PrepItem[];
}

export const IntelligenceSidebar = () => {
  const { data } = usePrediction();
  const [lgbmPrep, setLgbmPrep] = useState<LgbmPrep | null>(null);

  useEffect(() => {
    fetch("/lgbm-prep.json").then(r => r.json()).then(setLgbmPrep).catch(() => {});
  }, []);

  return (
    <aside className="space-y-5">
      <DriverCards />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-sm">
        <div className="relative h-32 bg-gradient-to-br from-primary-glow/20 via-accent/10 to-success/10">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 130" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="300" height="130" fill="url(#grid)" />
            <path d="M 0 75 L 300 70" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <path d="M 0 75 L 300 70" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeDasharray="6 6" />
            <rect x="210" y="60" width="4" height="20" fill="hsl(var(--foreground))" />
            <text x="218" y="58" fontSize="9" fontWeight="700" fill="hsl(var(--foreground))">FINISH</text>
            <circle cx="135" cy="72" r="9" fill="hsl(var(--danger))" stroke="hsl(var(--card))" strokeWidth="2.5" />
            <circle cx="135" cy="72" r="3" fill="hsl(var(--card))" />
          </svg>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MapPin className="h-4 w-4 text-danger" />
            Boylston St Location
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {data?.scenario.signals.event.distanceKm ?? 0.8} km from the Marathon finish line. Streets closed to vehicle delivery 7am–6pm.
          </p>
        </div>
      </div>

      {/* Marathon Day LightGBM item prep */}
      {lgbmPrep && (
        <div className="rounded-2xl border border-accent/30 bg-card p-5 shadow-elev-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Marathon Day Prep</h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 0.4 km · LightGBM · Apr 20 2026
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {lgbmPrep.items.map((item) => {
              const up = item.pct_change >= 0;
              return (
                <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-foreground">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {item.predicted_qty} units <span className="opacity-60">(was {item.baseline_qty})</span>
                    </div>
                  </div>
                  <span className={`flex shrink-0 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${up ? "border-success/20 bg-success-soft text-success" : "border-danger/20 bg-danger-soft text-danger"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {item.pct_change > 0 ? "+" : ""}{item.pct_change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </aside>
  );
};
