"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NotFoundContent() {
  // useSearchParams() is now safe inside this component that will be wrapped in Suspense
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "";

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-13 text-white p-4 text-center">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <h2 className="text-2xl mb-8">Page Not Found</h2>
      <p className="mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
        {from && (
          <span>
            {" "}
            You were redirected from <code>{from}</code>.
          </span>
        )}
      </p>
      <button
        onClick={handleReturnHome}
        className="px-6 py-3 bg-primary-6 text-primary-11 rounded-md hover:bg-primary-8 transition-colors"
      >
        Return Home
      </button>
    </div>
  );
}
