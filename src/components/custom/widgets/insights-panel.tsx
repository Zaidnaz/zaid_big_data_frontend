"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataQuality = {
  missing_pct?: number;
  missing_cells?: number;
  duplicate_rows?: number;
  numeric_columns?: number;
  categorical_columns?: number;
};

type Profile = {
  shape?: { rows?: number; columns?: number };
  data_quality?: DataQuality;
};

export function InsightsPanel({
  mode,
  insights,
  profile,
  clinicalFlags,
}: {
  mode?: "standard" | "max";
  insights?: string[];
  profile?: Profile;
  clinicalFlags?: Record<string, number>;
}) {
  const dq = profile?.data_quality;

  return (
    <Card className="rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Insights</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Data quality highlights and derived signals.
          </p>
        </div>
        {mode ? <Badge variant="secondary">{mode.toUpperCase()}</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Rows / Columns</div>
            <div className="text-sm font-medium">
              {profile?.shape?.rows ?? "—"} / {profile?.shape?.columns ?? "—"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Missing / Duplicates</div>
            <div className="text-sm font-medium">
              {dq?.missing_pct != null ? `${dq.missing_pct}%` : "—"} missing, {dq?.duplicate_rows ?? "—"} dup
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Numeric / Categorical cols</div>
            <div className="text-sm font-medium">
              {dq?.numeric_columns ?? "—"} / {dq?.categorical_columns ?? "—"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Clinical flags</div>
            <div className="text-sm font-medium">
              {clinicalFlags && Object.keys(clinicalFlags).length > 0
                ? Object.entries(clinicalFlags)
                    .slice(0, 2)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")
                : "—"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Key findings</div>
          {insights && insights.length > 0 ? (
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {insights.slice(0, 8).map((text, idx) => (
                <li key={idx}>{text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Run in Max mode to get deeper insights.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
