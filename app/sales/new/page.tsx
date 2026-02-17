import Sidebar from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SaleForm from "@/components/sale-form";

export default async function NewSalePage() {
  const user = await getCurrentUser();

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/sales" />
      <main className="ml-64 p-8">
        <h2 className="text-2xl font-semibold mb-6">New Sale</h2>
        <SaleForm products={formattedProducts} />
      </main>
    </div>
  );
}
