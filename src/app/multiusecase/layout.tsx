// src/app/multiusecase/layout.tsx
"use client";

import React, { Suspense, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MultiusecaseSidebar } from "@/components/multiusecase/MultiusecaseSidebar";

function isPublicFlow(pathname: string, searchParams: URLSearchParams | null) {
  // QR scan flow pages (public)
  if (pathname.startsWith("/multiusecase/register")) return true;
  if (pathname.startsWith("/multiusecase/photo-capture")) return true;
  if (pathname.startsWith("/multiusecase/scan")) return true;

  // If user is coming from QR link, token is a strong signal it’s public
  if (searchParams?.get("token")) return true;

  return false;
}

function shouldShowSidebar(pathname: string) {
  // Sidebar only for these portal pages
  const SIDEBAR_PREFIXES = [
    "/multiusecase/dashboard",
    "/multiusecase/qr", // covers /qr-codes, /qr-codes/...
    "/multiusecase/charity/partner", // Set Your Partner
    "/multiusecase/charity/set-password", // Set Your Password (adjust if your route differs)
  ];

  return SIDEBAR_PREFIXES.some((p) => pathname.startsWith(p));
}

function MultiusecaseLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showSidebar = useMemo(() => {
    if (!pathname) return false;
    if (isPublicFlow(pathname, searchParams)) return false;
    return shouldShowSidebar(pathname);
  }, [pathname, searchParams]);

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Suspense fallback={<div className="w-64" />}>
        <MultiusecaseSidebar />
      </Suspense>

      <div className="flex-1 lg:ml-64">{children}</div>
    </div>
  );
}

export default function MultiusecaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <MultiusecaseLayoutContent>{children}</MultiusecaseLayoutContent>
    </Suspense>
  );
}
