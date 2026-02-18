import Sidebar from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import MarkAsPaidButton from "@/components/mark-paid-button";
import Pagination from "@/components/pagination";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();

  const params = await searchParams;

  const pageSize = 10;

  const where = { userId: user.id };

  const [totalCount, sales] = await Promise.all([
    prisma.sale.count({ where }),

    prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
      skip: (Number(params.page ?? 1) - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const page = Math.max(1, Number(params.page ?? 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/sales" />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Sales</h2>
            <p className="text-sm text-gray-500">Track completed sales</p>
          </div>

          <Link
            href="/sales/new"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            New Sale
          </Link>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Date</th>
                <th className="px-6 py-3 text-left text-sm">Buyer</th>
                <th className="px-6 py-3 text-left text-sm">Items</th>
                <th className="px-6 py-3 text-left text-sm">Total</th>
                <th className="px-6 py-3 text-left text-sm">Payment Method</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 text-sm">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {sale.buyerName}
                    {sale.buyerPhone && (
                      <div className="text-gray-500 text-xs">
                        {sale.buyerPhone}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {sale.items.map((item) => (
                      <div key={item.id}>
                        {item.product.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold">
                    ${sale.total.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {sale.paymentMethod ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {sale.isPaid ? (
                      <span className="text-green-600 font-medium">Paid</span>
                    ) : (
                      <MarkAsPaidButton saleId={sale.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/sales"
                searchParams={{
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
