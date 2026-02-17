"use client";

import { useState } from "react";
import { markAsPaid } from "@/lib/actions/sales";

interface Props {
  saleId: string;
}

export default function MarkAsPaidButton({ saleId }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:underline text-sm cursor-pointer"
      >
        Mark as Paid
      </button>
    );
  }

  return (
    <form action={markAsPaid} className="flex gap-2">
      <input type="hidden" name="id" value={saleId} />

      <select
        name="paymentMethod"
        required
        className="px-2 py-1 border rounded text-sm"
      >
        <option value="">Select</option>
        <option value="Cash">Cash</option>
        <option value="BKash">BKash</option>
        <option value="Nagad">Nagad</option>
        <option value="Rocket">Rocket</option>
        <option value="BankTransfer">Bank Transfer</option>
      </select>

      <button
        type="submit"
        className="text-blue-600 hover:underline text-sm cursor-pointer"
      >
        Confirm
      </button>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-gray-500 text-sm"
      >
        Cancel
      </button>
    </form>
  );
}
