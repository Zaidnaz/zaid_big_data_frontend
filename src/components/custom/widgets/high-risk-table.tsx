"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type PatientRecord = Record<string, unknown>;

function pickColumns(records: PatientRecord[]): string[] {
  if (records.length === 0) return [];

  const keys = Object.keys(records[0]);
  const normalized = new Map(keys.map((k) => [k.toLowerCase(), k]));

  const candidates = [
    "patient_id",
    "patientid",
    "id",
    "name",
    "patient_name",
    "age",
    "bmi",
    "blood_pressure",
    "bloodpressure",
    "risk_level",
  ];

  const picked: string[] = [];
  for (const c of candidates) {
    const hit = normalized.get(c);
    if (hit && !picked.includes(hit)) picked.push(hit);
    if (picked.length >= 6) break;
  }

  if (picked.length >= 3) return picked;
  return keys.slice(0, Math.min(6, keys.length));
}

export function HighRiskTable({ patients }: { patients: PatientRecord[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const columns = useMemo(() => pickColumns(patients), [patients]);

  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = patients.slice(start, start + pageSize);

  return (
    <Card className="h-full rounded-xl">
      <CardHeader className="pb-2">
        <div className="widget-drag-handle cursor-move select-none">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            High-Risk Patients (Top)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-3.25rem)] flex-col gap-4">
        <div className="rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="whitespace-nowrap">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-muted-foreground">
                    No high-risk patients found in this dataset.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => {
                      const value = row[col];
                      if (col.toLowerCase() === "risk_level") {
                        const isHigh = String(value).toLowerCase() === "high";
                        return (
                          <TableCell key={col}>
                            <Badge variant={isHigh ? "default" : "secondary"}>
                              {String(value)}
                            </Badge>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={col} className="whitespace-nowrap">
                          {value === null || value === undefined ? "—" : String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
