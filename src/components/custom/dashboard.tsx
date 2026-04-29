"use client";

import { useMemo, useRef, useState } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { toPng } from "html-to-image";
import { AlertTriangle, Download, Loader2, Timer, Users } from "lucide-react";
import { MetricCard } from "@/components/custom/widgets/metric-card";
import { RiskDistributionPie } from "@/components/custom/widgets/risk-distribution-pie";
import { CorrelationsBar } from "@/components/custom/widgets/correlations-bar";
import { HighRiskTable } from "@/components/custom/widgets/high-risk-table";
import { InsightsPanel } from "@/components/custom/widgets/insights-panel";
import { HistogramBar } from "@/components/custom/widgets/histogram-bar";
import { Button } from "@/components/ui/button";

// Define types for our analytics data
interface AnalyticsData {
    metrics: {
      total_patients: number;
      anomaly_count: number;
      execution_time_seconds: number;
    };
    visualizations: {
      risk_distribution: { [key: string]: number };
      correlations: { [key: string]: number };
      histograms?: Record<string, { bin: string; count: number }[]>;
    };
    high_risk_patients: any[];
    mode?: "standard" | "max";
    insights?: string[];
    profile?: {
      shape?: { rows?: number; columns?: number };
      data_quality?: {
        missing_pct?: number;
        missing_cells?: number;
        duplicate_rows?: number;
        numeric_columns?: number;
        categorical_columns?: number;
      };
    };
    clinical_flags?: Record<string, number>;
  }

interface DashboardProps {
  data: AnalyticsData;
}

export function Dashboard({ data }: DashboardProps) {
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: 1200,
  });

  const exportRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const showInsights =
    data.mode === "max" &&
    (!!data.profile || (data.insights?.length ?? 0) > 0 || !!data.clinical_flags);

  const hist = data.visualizations.histograms ?? {};
  const hasAge = Array.isArray(hist.age) && hist.age.length > 0;
  const hasBmi = Array.isArray(hist.bmi) && hist.bmi.length > 0;
  const hasBp = Array.isArray(hist.blood_pressure) && hist.blood_pressure.length > 0;

  const itemOrder = useMemo(() => {
    const items: string[] = [
      "metric_total",
      "metric_anomaly",
      "metric_time",
      "hist_risk",
      "bar",
      "pie",
    ];
    if (hasAge) items.push("hist_age");
    if (hasBmi) items.push("hist_bmi");
    if (hasBp) items.push("hist_bp");
    if (showInsights) items.push("insights");
    items.push("table");
    return items;
  }, [hasAge, hasBmi, hasBp, showInsights]);

  const stackedLayout = (cols: number) => {
    const heights: Record<string, number> = {
      metric_total: 1,
      metric_anomaly: 1,
      metric_time: 1,
      hist_risk: 2,
      bar: 2,
      pie: 2,
      hist_age: 2,
      hist_bmi: 2,
      hist_bp: 2,
      insights: 2,
      table: 3,
    };

    let y = 0;
    return itemOrder.map((i) => {
      const h = heights[i] ?? 2;
      const layout = { i, x: 0, y, w: cols, h };
      y += h;
      return layout;
    });
  };

  const layoutLg = [
    { i: "metric_total", x: 0, y: 0, w: 4, h: 1 },
    { i: "metric_anomaly", x: 4, y: 0, w: 4, h: 1 },
    { i: "metric_time", x: 8, y: 0, w: 4, h: 1 },
    { i: "hist_risk", x: 0, y: 1, w: 6, h: 2 },
    { i: "bar", x: 6, y: 1, w: 6, h: 2 },
    { i: "pie", x: 0, y: 3, w: 4, h: 2 },
    ...(hasAge ? [{ i: "hist_age", x: 4, y: 3, w: 4, h: 2 }] : []),
    ...(hasBmi ? [{ i: "hist_bmi", x: 8, y: 3, w: 4, h: 2 }] : []),
    ...(hasBp ? [{ i: "hist_bp", x: 0, y: 5, w: 6, h: 2 }] : []),
    ...(showInsights ? [{ i: "insights", x: 6, y: 5, w: 6, h: 2 }] : []),
    {
      i: "table",
      x: 0,
      y: 7,
      w: 12,
      h: 3,
    },
  ];

  const layouts = useMemo(() => {
    return {
      lg: layoutLg,
      md: stackedLayout(10),
      sm: stackedLayout(6),
      xs: stackedLayout(4),
      xxs: stackedLayout(2),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemOrder.join("|"), showInsights, hasAge, hasBmi, hasBp]);

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const bg = getComputedStyle(exportRef.current).backgroundColor;
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: bg,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `healthcare-dashboard-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {mounted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PNG
            </Button>
          </div>

          <div ref={exportRef} className="rounded-xl">
            <Responsive
              className="layout"
              width={width}
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={150}
              containerPadding={[0, 0]}
              margin={[16, 16]}
            >
              <div key="metric_total" className="h-full">
                <MetricCard
                  title="Total Patients Processed"
                  value={String(data.metrics.total_patients)}
                  icon={<Users className="h-4 w-4" />}
                  subtext="In-memory batch processing"
                />
              </div>

              <div key="metric_anomaly" className="h-full">
                <MetricCard
                  title="Anomaly Count"
                  value={String(data.metrics.anomaly_count)}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  subtext="Simulated detection rate"
                />
              </div>

              <div key="metric_time" className="h-full">
                <MetricCard
                  title="Query Execution Time"
                  value={`${data.metrics.execution_time_seconds}s`}
                  icon={<Timer className="h-4 w-4" />}
                  subtext="Pipeline + model inference"
                />
              </div>

              <div key="bar" className="h-full">
                <CorrelationsBar correlations={data.visualizations.correlations} />
              </div>

              <div key="hist_risk" className="h-full">
                <HistogramBar
                  title="Risk Score Histogram"
                  subtitle="Distribution across 10 bins (0–1)"
                  data={hist.risk_score ?? []}
                />
              </div>

              <div key="pie" className="h-full">
                <RiskDistributionPie
                  riskDistribution={data.visualizations.risk_distribution}
                />
              </div>

              {hasAge ? (
                <div key="hist_age" className="h-full">
                  <HistogramBar
                    title="Age Distribution"
                    subtitle="Detected column"
                    data={hist.age ?? []}
                  />
                </div>
              ) : null}

              {hasBmi ? (
                <div key="hist_bmi" className="h-full">
                  <HistogramBar
                    title="BMI Distribution"
                    subtitle="Detected column"
                    data={hist.bmi ?? []}
                  />
                </div>
              ) : null}

              {hasBp ? (
                <div key="hist_bp" className="h-full">
                  <HistogramBar
                    title="Blood Pressure Distribution"
                    subtitle="Detected column"
                    data={hist.blood_pressure ?? []}
                  />
                </div>
              ) : null}

              {showInsights ? (
                <div key="insights" className="h-full">
                  <InsightsPanel
                    mode={data.mode}
                    insights={data.insights}
                    profile={data.profile}
                    clinicalFlags={data.clinical_flags}
                  />
                </div>
              ) : null}

              <div key="table" className="h-full">
                <HighRiskTable patients={data.high_risk_patients} />
              </div>
            </Responsive>
          </div>
        </div>
      ) : null}
    </div>
  );
}
