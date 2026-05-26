import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const CustomerMap = lazy(() => import("./CustomerMap").then(m => ({ default: m.CustomerMap })));

export function CustomerMapClient(props: { lat: number; lng: number; label?: string }) {
  return (
    <ClientOnly fallback={<div className="h-80 w-full animate-pulse rounded-lg border border-border bg-muted" />}>
      <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-lg border border-border bg-muted" />}>
        <CustomerMap {...props} />
      </Suspense>
    </ClientOnly>
  );
}
