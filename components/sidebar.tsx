"use client";

import Image from "next/image";
import {
  BarChart3,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { useState } from "react";

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Sales", href: "/sales", icon: ShoppingCart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center px-4 z-20">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center ml-4">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="ml-2 font-semibold">Stock Buddy</span>
        </div>

        <div className="ml-auto">
          <UserButton />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-30 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Close button mobile */}
        <div className="flex justify-between items-center lg:hidden mb-6">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex items-center space-x-2 mb-8">
          <Image src="/logo.png" alt="logo" width={48} height={48} />
          <p className="text-lg font-semibold">Stock Buddy</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <div className="text-sm font-semibold text-gray-400 uppercase">
            Inventory
          </div>

          {navigation.map((item, key) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;

            return (
              <Link
                key={key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-gray-800"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <UserButton showUserInfo />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        />
      )}
    </>
  );
}
