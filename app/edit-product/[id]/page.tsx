import Sidebar from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: TProps) {
  const { id } = await params;

  const user = await getCurrentUser();

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product || product.userId !== user.id) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  async function updateProductWithId(formData: FormData) {
    "use server";
    await updateProduct(id, formData);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/edit-product" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Product</h2>
          <p className="text-sm text-gray-500">Update your product details.</p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="space-y-6" action={updateProductWithId}>
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    required
                    defaultValue={product.quantity}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={product.price.toFixed(2)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (optional)
                </label>
                <input
                  type="text"
                  name="sku"
                  defaultValue={product.sku ?? ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Low Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock At (optional)
                </label>
                <input
                  type="number"
                  name="lowStock"
                  min="0"
                  defaultValue={product.lowStock ?? ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update Product
                </button>

                <a
                  href="/inventory"
                  className="px-6 py-3 bg-purple-200 text-gray-800 rounded-lg hover:bg-purple-300"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
