"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // In a real app, you'd use context or a state manager.
      // For this stateless app, we'll pass it via query params for simplicity,
      // though localStorage would also be a good choice.
      localStorage.setItem("userName", name);
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Healthcare Big Data Analytics
        </CardTitle>
        <CardDescription className="pt-2">
          Enter your Name or Doctor ID to proceed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name or ID</Label>
            <Input
              id="name"
              type="text"
              placeholder="Dr. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
          <Button type="submit" className="w-full rounded-lg">
            Access Dashboard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
