"use client";

import { useEffect, useState } from "react";

export default function BulkDeleteButton() {
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      const checked = document.querySelectorAll(
        'input[name="ids"]:checked',
      ).length;

      setHasSelection(checked > 0);
    };

    document.addEventListener("change", handleChange);

    return () => {
      document.removeEventListener("change", handleChange);
    };
  }, []);

  if (!hasSelection) return null;

  return (
    <button
      type="submit"
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Delete Selected
    </button>
  );
}
