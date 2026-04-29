"use client";

import { useEffect, useState } from "react";
import { FileUpload } from "@/components/custom/file-upload";
import { Dashboard } from "@/components/custom/dashboard";
import { ManualInput } from "@/components/custom/manual-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  options_applied?: Record<string, unknown>;
  columns_used?: Record<string, string | null>;
  insights?: string[];
  profile?: Record<string, unknown>;
  clinical_flags?: Record<string, number>;
}

type AnalyzeResponse = AnalyticsData;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"standard" | "max">("standard");
  const [riskThreshold, setRiskThreshold] = useState(0.65);
  const [anomalyZThreshold, setAnomalyZThreshold] = useState(3.0);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  const readErrorMessage = async (response: Response) => {
    try {
      const payload = await response.json();
      if (payload?.detail) return String(payload.detail);
      if (payload?.error) return String(payload.error);
      return response.statusText || "Request failed";
    } catch {
      return response.statusText || "Request failed";
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const params = new URLSearchParams({
        mode,
        risk_threshold: String(riskThreshold),
        anomaly_z_threshold: String(anomalyZThreshold),
      });

      const response = await fetch(`${API_BASE}/api/upload?${params.toString()}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data: AnalyzeResponse = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeRecords = async (records: Record<string, unknown>[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records,
          mode,
          options: {
            risk_threshold: riskThreshold,
            anomaly_z_threshold: anomalyZThreshold,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data: AnalyzeResponse = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userName || "Doctor"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {!analyticsData
            ? "Use quick demo input or upload a dataset to begin."
            : "Here is your interactive analytics dashboard."}
        </p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!analyticsData ? (
        <div className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Analysis Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose Standard vs Max, and tune sensitivity.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={mode === "standard" ? "default" : "outline"}
                      onClick={() => setMode("standard")}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Standard
                    </Button>
                    <Button
                      type="button"
                      variant={mode === "max" ? "default" : "outline"}
                      onClick={() => setMode("max")}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskThreshold">High-risk threshold</Label>
                  <Input
                    id="riskThreshold"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={riskThreshold}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v)) setRiskThreshold(v);
                    }}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anomalyZ">Anomaly z-threshold</Label>
                  <Input
                    id="anomalyZ"
                    type="number"
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={anomalyZThreshold}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v)) setAnomalyZThreshold(v);
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Max mode returns deeper profiling + extra insights.
              </p>
            </CardContent>
          </Card>

          <ManualInput isLoading={isLoading} onAnalyze={handleAnalyzeRecords} />

          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground">OR</p>
          </div>

          <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>
      ) : (
        <Dashboard data={analyticsData} />
      )}
    </div>
  );
}
