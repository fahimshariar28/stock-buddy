"use client";

import { useMemo, useState } from "react";
import { createSale } from "@/lib/actions/sales";
import { X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number; // already converted from Decimal in server
  quantity: number;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

interface SaleFormProps {
  products: Product[];
}

export default function SaleForm({ products }: SaleFormProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const addToCart = (product: Product) => {
    if (product.quantity === 0) return;

    setCart((prev) => {
      const existing = prev.find((p) => p.productId === product.id);

      if (existing) {
        if (existing.quantity >= product.quantity) return prev;

        return prev.map((p) =>
          p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, rawValue: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;

        // 👇 Allow empty input temporarily
        if (rawValue === "") {
          return { ...item, quantity: 0 };
        }

        let qty = Number(rawValue);

        if (qty > item.stock) qty = item.stock;
        if (qty < 0) qty = 0;

        return { ...item, quantity: qty };
      }),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const hasInvalidQuantity = cart.some((item) => item.quantity === 0);

  return (
    <form action={createSale} className="grid grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="col-span-2 space-y-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="grid grid-cols-3 gap-4 max-h-150 overflow-y-auto">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.quantity === 0;

            return (
              <button
                type="button"
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className={`p-4 border rounded-lg text-left 
                ${
                  isOutOfStock
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{product.name}</div>

                <div className="text-sm text-gray-500">
                  Stock: {product.quantity}
                </div>

                <div className="text-sm font-semibold">
                  ${product.price.toFixed(2)}
                </div>

                {isOutOfStock && (
                  <div className="text-xs text-red-500 mt-1">Out of stock</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE — CART */}
      <div className="bg-white border rounded-lg p-6 space-y-4 h-fit sticky top-8">
        <h3 className="text-lg font-semibold">Cart</h3>

        {cart.length === 0 && (
          <p className="text-sm text-gray-500">No products added</p>
        )}

        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">Stock: {item.stock}</div>
              <div className="text-xs text-gray-500">
                ${item.price.toFixed(2)} each
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, e.target.value)}
                className="w-16 px-2 py-1 border rounded"
              />

              <button
                type="button"
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 font-semibold">
          Total: ${total.toFixed(2)}
        </div>

        <input
          type="hidden"
          name="items"
          value={JSON.stringify(cart.filter((item) => item.quantity > 0))}
        />

        <div className="space-y-3 pt-4">
          <input
            name="buyerName"
            required
            placeholder="Buyer Name"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="buyerPhone"
            placeholder="Buyer Phone (optional)"
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="space-y-3 pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="payLater"
              className="accent-purple-600"
            />
            Pay Later
          </label>

          <select
            name="paymentMethod"
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="BKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="BankTransfer">Bank Transfer</option>
          </select>
        </div>

        <button
          disabled={cart.length === 0 || hasInvalidQuantity}
          className="w-full mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Complete Sale
        </button>
      </div>
    </form>
  );
}
