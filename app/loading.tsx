"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Package, Plus, Settings, ShoppingCart } from "lucide-react";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import Link from "next/link";

/* ---------------- Skeleton ---------------- */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} />
  );
}

/* ---------------- Sidebar Skeleton ---------------- */

function LoadingSidebar() {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Sales", href: "/sales", icon: ShoppingCart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="hidden lg:flex fixed left-0 top-0 w-64 min-h-screen bg-gray-900 text-white flex-col p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Stock Buddy Logo"
            width={48}
            height={48}
          />
          <p className="text-lg font-semibold">Stock Buddy</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Inventory
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
        <UserButton />
      </div>
    </div>
  );
}

/* ---------------- Dashboard Skeleton ---------------- */

function DashboardSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-6">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>

      {/* Chart + Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-56 w-full" />
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Main Layout ---------------- */

function MainContentSkeleton({ showSidebar }: { showSidebar: boolean }) {
  return (
    <main
      className={
        showSidebar ? "lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8" : "p-4 lg:p-8"
      }
    >
      <DashboardSkeleton />
    </main>
  );
}

/* ---------------- Loading Page ---------------- */

export default function Loading() {
  const pathname = usePathname();

  const showSidebar = !["/", "/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && <LoadingSidebar />}
      <MainContentSkeleton showSidebar={showSidebar} />
    </div>
  );
}
