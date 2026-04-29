"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type HistogramPoint = {
  bin: string;
  count: number;
};

export function HistogramBar({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: HistogramPoint[];
}) {
  return (
    <Card className="h-full rounded-xl">
      <CardHeader className="pb-2">
        <div className="widget-drag-handle cursor-move select-none">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {subtitle ? (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-3.25rem)]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No data available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="bin"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") return [value, "Count"];
                  return [String(value), "Count"];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
