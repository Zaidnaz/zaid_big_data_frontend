"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Correlations = Record<string, number>;

export function CorrelationsBar({ correlations }: { correlations: Correlations }) {
  const data = Object.entries(correlations).map(([name, value]) => ({
    name,
    value: Math.max(0, Math.min(1, value)),
  }));

  return (
    <Card className="h-full rounded-xl">
      <CardHeader className="pb-2">
        <div className="widget-drag-handle cursor-move select-none">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Feature Correlations (Simulated)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-3.25rem)]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No correlation-ready columns detected.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [value.toFixed(2), "Correlation"];
                  }
                  if (value === null || value === undefined) {
                    return ["—", "Correlation"];
                  }
                  return [String(value), "Correlation"];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
