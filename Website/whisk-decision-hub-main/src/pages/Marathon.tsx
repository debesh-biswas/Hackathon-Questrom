import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, MapPin, Users, Zap } from "lucide-react";

interface Restaurant {
  restaurant_id: string;
  dist_to_marathon_km: number;
  predicted_covers: number;
  baseline_covers: number;
  lift_pct: number;
  seating_capacity: number;
  price_tier: number;
  is_fast_food: number;
  is_health_focused: number;
  cuisine_category: number;
}

interface MarathonData {
  event: string;
  date: string;
  model: string;
  total_predicted_covers: number;
  avg_lift_pct: number;
  restaurants: Restaurant[];
}

const PRICE_LABELS: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
const CUISINE_LABELS: Record<number, string> = {
  0: "American", 1: "Asian", 2: "Cafe", 3: "Fast Casual",
  4: "Italian", 5: "Mexican", 6: "Seafood", 7: "Other",
};

export default function Marathon() {
  const [data, setData] = useState<MarathonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "near" | "far">("all");

  useEffect(() => {
    fetch("/marathon-predictions.json")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-red-500">
      Error: {error}
    </div>
  );
  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Loading predictions…
    </div>
  );

  const restaurants = data.restaurants.filter((r) => {
    if (filter === "near") return r.dist_to_marathon_km <= 2;
    if (filter === "far") return r.dist_to_marathon_km > 2;
    return true;
  });

  const topLift = [...data.restaurants].sort((a, b) => b.lift_pct - a.lift_pct).slice(0, 5);
  const topVolume = data.restaurants.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏃</span>
            <div>
              <h1 className="text-2xl font-bold">Boston Marathon 2026 — Demand Forecast</h1>
              <p className="text-sm text-muted-foreground">
                {data.date} · LightGBM model ({data.model}) · {data.restaurants.length} restaurants
              </p>
            </div>
          </div>

          {/* KPI row */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Total Predicted Covers</p>
              <p className="mt-1 text-3xl font-bold text-accent">{data.total_predicted_covers.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Avg Lift vs Baseline</p>
              <p className={`mt-1 text-3xl font-bold ${data.avg_lift_pct >= 0 ? "text-green-500" : "text-red-400"}`}>
                {data.avg_lift_pct > 0 ? "+" : ""}{data.avg_lift_pct}%
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Restaurants &lt;2 km</p>
              <p className="mt-1 text-3xl font-bold">
                {data.restaurants.filter((r) => r.dist_to_marathon_km <= 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* Top gainers */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-green-500" /> Top 5 by Lift %
            </h2>
            <div className="space-y-3">
              {topLift.map((r) => (
                <div key={r.restaurant_id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{r.restaurant_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{r.dist_to_marathon_km} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{r.predicted_covers} covers</p>
                    <p className={`text-xs font-semibold ${r.lift_pct >= 0 ? "text-green-500" : "text-red-400"}`}>
                      {r.lift_pct > 0 ? "+" : ""}{r.lift_pct}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-yellow-500" /> Top 5 by Predicted Volume
            </h2>
            <div className="space-y-3">
              {topVolume.map((r) => (
                <div key={r.restaurant_id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{r.restaurant_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {CUISINE_LABELS[r.cuisine_category] ?? "Other"} · {PRICE_LABELS[r.price_tier] ?? "?"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{r.predicted_covers} covers</p>
                    <p className="text-xs text-muted-foreground">cap {r.seating_capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4" /> All Restaurants
            </h2>
            <div className="flex gap-2">
              {(["all", "near", "far"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    filter === f ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "all" ? "All" : f === "near" ? "< 2 km" : "> 2 km"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left">Restaurant</th>
                  <th className="px-4 py-3 text-left">Cuisine</th>
                  <th className="px-4 py-3 text-right">Dist (km)</th>
                  <th className="px-4 py-3 text-right">Baseline</th>
                  <th className="px-4 py-3 text-right">Predicted</th>
                  <th className="px-4 py-3 text-right">Lift %</th>
                  <th className="px-4 py-3 text-right">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r, i) => (
                  <tr key={r.restaurant_id} className={`border-b border-border/50 hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-2 font-mono text-xs">{r.restaurant_id.slice(0, 8)}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{CUISINE_LABELS[r.cuisine_category] ?? "Other"}</td>
                    <td className="px-4 py-2 text-right text-xs">{r.dist_to_marathon_km}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{r.baseline_covers}</td>
                    <td className="px-4 py-2 text-right font-semibold">{r.predicted_covers}</td>
                    <td className={`px-4 py-2 text-right font-semibold ${r.lift_pct >= 0 ? "text-green-500" : "text-red-400"}`}>
                      <span className="flex items-center justify-end gap-1">
                        {r.lift_pct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {r.lift_pct > 0 ? "+" : ""}{r.lift_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-muted-foreground">{r.seating_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
