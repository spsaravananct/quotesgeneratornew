import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import QuoteCard from "@/components/QuoteCard";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <QuoteCard />
        </CardContent>
      </Card>
    </div>
  );
}
