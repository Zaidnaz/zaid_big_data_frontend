"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type RiskDistribution = Record<string, number>;

export function RiskDistributionPie({
  riskDistribution,
}: {
  riskDistribution: RiskDistribution;
}) {
  const entries = Object.entries(riskDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

  return (
    <Card className="h-full rounded-xl">
      <CardHeader className="pb-2">
        <div className="widget-drag-handle cursor-move select-none">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Risk Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-3.25rem)]">
        {entries.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No risk labels available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={entries}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {entries.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
