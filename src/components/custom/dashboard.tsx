"use client";

import { Responsive, useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Users, AlertTriangle, Timer } from "lucide-react";
import { MetricCard } from "@/components/custom/widgets/metric-card";
import { RiskDistributionPie } from "@/components/custom/widgets/risk-distribution-pie";
import { CorrelationsBar } from "@/components/custom/widgets/correlations-bar";
import { HighRiskTable } from "@/components/custom/widgets/high-risk-table";
import { InsightsPanel } from "@/components/custom/widgets/insights-panel";

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

  const showInsights =
    data.mode === "max" &&
    (!!data.profile || (data.insights?.length ?? 0) > 0 || !!data.clinical_flags);

  const layoutLg = [
    { i: "metric_total", x: 0, y: 0, w: 4, h: 1 },
    { i: "metric_anomaly", x: 4, y: 0, w: 4, h: 1 },
    { i: "metric_time", x: 8, y: 0, w: 4, h: 1 },
    { i: "bar", x: 0, y: 1, w: 8, h: 2 },
    { i: "pie", x: 8, y: 1, w: 4, h: 2 },
    ...(showInsights ? [{ i: "insights", x: 0, y: 3, w: 12, h: 2 }] : []),
    { i: "table", x: 0, y: showInsights ? 5 : 3, w: 12, h: 3 },
  ];

  return (
    <div ref={containerRef} className="w-full">
      {mounted ? (
        <Responsive
          className="layout"
          width={width}
          layouts={{ lg: layoutLg }}
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

          <div key="pie" className="h-full">
            <RiskDistributionPie
              riskDistribution={data.visualizations.risk_distribution}
            />
          </div>

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
      ) : null}
    </div>
  );
}
