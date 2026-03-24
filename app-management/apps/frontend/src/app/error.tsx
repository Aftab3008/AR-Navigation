"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-100 flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm mt-8">
      <div className="bg-red-50 p-3 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong!
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        {error.message ||
          "There was a problem communicating with the server. Please try again later."}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Try again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
