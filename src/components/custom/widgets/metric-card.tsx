"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  icon,
  subtext,
}: {
  title: string;
  value: string;
  icon?: ReactNode;
  subtext?: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <div className="widget-drag-handle flex items-center justify-between gap-3 cursor-move select-none">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {subtext ? (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
