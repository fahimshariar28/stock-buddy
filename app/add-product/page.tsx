import Sidebar from "@/components/sidebar";
import { addProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddProductPage() {
  await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-product" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h2>
              <p className="text-sm text-gray-500">
                Add a new product to your inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="space-y-6" action={addProduct}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SKU (optional)
                </label>
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label
                  htmlFor="lowStock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Low Stock At (optional)
                </label>
                <input
                  type="number"
                  name="lowStock"
                  id="lowStock"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter Low Stock Threshold"
                />
              </div>
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                >
                  Add Product
                </button>
                <button>
                  <Link
                    href="/inventory"
                    className="px-6 py-3 bg-purple-200 text-gray-800 rounded-lg hover:bg-purple-300 cursor-pointer"
                  >
                    Cancel
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
