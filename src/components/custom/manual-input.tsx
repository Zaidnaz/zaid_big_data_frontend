"use client";

import { useMemo, useState } from "react";
import { Dices, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ManualPatientRow = {
  patient_id: string;
  name: string;
  age: string;
  bmi: string;
  blood_pressure: string;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)];
}

function generateRows(count: number): ManualPatientRow[] {
  const first = [
    "Aisha",
    "Omar",
    "Fatima",
    "Zain",
    "Hassan",
    "Mariam",
    "Ali",
    "Sara",
    "Amara",
    "Noah",
    "Liam",
    "Emma",
    "Olivia",
    "Ava",
    "Sophia",
    "Isabella",
    "Mateo",
    "Santiago",
    "Valentina",
    "Camila",
    "Diego",
    "Wei",
    "Min",
    "Yuna",
    "Haruto",
    "Sora",
    "Ananya",
    "Arjun",
    "Priya",
    "Isha",
    "Kwame",
    "Amina",
    "Zuri",
    "Chinedu",
    "Sofia",
    "Elena",
    "Luca",
    "Nadia",
    "Ivan",
    "Mila",
  ];

  const last = [
    "Khan",
    "Ahmed",
    "Malik",
    "Syed",
    "Raza",
    "Iqbal",
    "Shah",
    "Butt",
    "Smith",
    "Johnson",
    "Brown",
    "Garcia",
    "Martinez",
    "Lopez",
    "Gonzalez",
    "Hernandez",
    "Lee",
    "Kim",
    "Park",
    "Chen",
    "Wang",
    "Li",
    "Singh",
    "Patel",
    "Sharma",
    "Gupta",
    "Okafor",
    "Mensah",
    "Diallo",
    "Ivanov",
    "Petrov",
    "Novak",
    "Rossi",
    "Bianchi",
    "Dubois",
    "Martin",
    "Nguyen",
    "Tran",
    "Haddad",
    "Hassan",
  ];

  return Array.from({ length: count }).map((_, idx) => {
    const age = randInt(18, 90);
    const bmi = (Math.random() * 14 + 18).toFixed(1);
    const bp = randInt(95, 180);

    return {
      patient_id: `P-${String(idx + 1).padStart(3, "0")}`,
      name: `${randChoice(first)} ${randChoice(last)}`,
      age: String(age),
      bmi: String(bmi),
      blood_pressure: String(bp),
    };
  });
}

export function ManualInput({
  isLoading,
  onAnalyze,
}: {
  isLoading: boolean;
  onAnalyze: (records: Record<string, unknown>[]) => void;
}) {
  const [rowCount, setRowCount] = useState(200);
  const [rows, setRows] = useState<ManualPatientRow[]>(() => generateRows(50));

  const records = useMemo(() => {
    return rows.map((r) => ({
      patient_id: r.patient_id,
      name: r.name,
      age: r.age === "" ? null : Number(r.age),
      bmi: r.bmi === "" ? null : Number(r.bmi),
      blood_pressure: r.blood_pressure === "" ? null : Number(r.blood_pressure),
    }));
  }, [rows]);

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">Quick Demo Input</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Edit records or generate a larger batch for analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows</span>
            <Input
              type="number"
              min={10}
              max={2000}
              step={10}
              value={rowCount}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v)) setRowCount(Math.max(10, Math.min(2000, v)));
              }}
              className="h-9 w-[120px]"
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setRows(generateRows(rowCount))}
            disabled={isLoading}
          >
            <Dices className="h-4 w-4 mr-2" />
            Random
          </Button>
          <Button
            type="button"
            onClick={() => onAnalyze(records)}
            disabled={isLoading || rows.length === 0}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Tip: generating 200–1000 rows gives a more “big data” feel without uploading a file.
        </p>
        <div className="rounded-xl border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Patient ID</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Age</TableHead>
                <TableHead className="whitespace-nowrap">BMI</TableHead>
                <TableHead className="whitespace-nowrap">Blood Pressure</TableHead>
                <TableHead className="w-[1%]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.patient_id}>
                  <TableCell className="min-w-[120px]">
                    <Input
                      value={row.patient_id}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, patient_id: e.target.value } : p
                          )
                        )
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    <Input
                      value={row.name}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, name: e.target.value } : p
                          )
                        )
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell className="min-w-[110px]">
                    <Input
                      inputMode="numeric"
                      value={row.age}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, age: e.target.value } : p
                          )
                        )
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell className="min-w-[110px]">
                    <Input
                      inputMode="decimal"
                      value={row.bmi}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, bmi: e.target.value } : p
                          )
                        )
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <Input
                      inputMode="numeric"
                      value={row.blood_pressure}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? { ...p, blood_pressure: e.target.value }
                              : p
                          )
                        )
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setRows((prev) => prev.filter((_, i) => i !== idx))
                      }
                      disabled={isLoading}
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setRows((prev) => [
                ...prev,
                {
                  patient_id: `P-${String(prev.length + 1).padStart(3, "0")}`,
                  name: "",
                  age: "",
                  bmi: "",
                  blood_pressure: "",
                },
              ])
            }
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
