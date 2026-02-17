import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RevenueChart from "@/components/revenue-chart";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [sales, unpaidSales, products, saleItems] = await Promise.all([
    prisma.sale.findMany({ where: { userId } }),
    prisma.sale.findMany({
      where: { userId, isPaid: false },
    }),
    prisma.product.findMany({ where: { userId } }),
    prisma.saleItem.findMany({
      where: { sale: { userId } },
      include: { product: true },
    }),
  ]);

  // ========================
  // REVENUE
  // ========================

  const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total), 0);

  const thisMonthRevenue = sales
    .filter((s) => s.createdAt >= startOfThisMonth)
    .reduce((acc, s) => acc + Number(s.total), 0);

  const totalDue = unpaidSales.reduce((acc, s) => acc + Number(s.total), 0);

  // ========================
  // INVENTORY
  // ========================

  const inventoryValue = products.reduce(
    (acc, p) => acc + Number(p.price) * p.quantity,
    0,
  );

  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= (p.lowStock || 5),
  ).length;

  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  // ========================
  // REVENUE CHART (6 MONTHS)
  // ========================

  const revenueChartData = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const monthRevenue = sales
      .filter((s) => s.createdAt >= start && s.createdAt <= end)
      .reduce((acc, s) => acc + Number(s.total), 0);

    revenueChartData.push({
      month: start.toLocaleString("default", {
        month: "short",
      }),
      revenue: monthRevenue,
    });
  }

  // ========================
  // PAYMENT METHOD BREAKDOWN
  // ========================

  const paymentMethods = sales.reduce((acc: Record<string, number>, sale) => {
    if (sale.paymentMethod) {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
    }
    return acc;
  }, {});

  // ========================
  // TOP SELLING PRODUCTS
  // ========================

  const productSalesMap: Record<string, { name: string; qty: number }> = {};

  saleItems.forEach((item) => {
    const id = item.productId;

    if (!productSalesMap[id]) {
      productSalesMap[id] = {
        name: item.product.name,
        qty: 0,
      };
    }

    productSalesMap[id].qty += item.quantity;
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />

      <main className="ml-64 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">POS Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your business performance.
          </p>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Metric title="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} />
          <Metric
            title="This Month Revenue"
            value={`$${thisMonthRevenue.toFixed(0)}`}
          />
          <Metric
            title="Outstanding Due"
            value={`$${totalDue.toFixed(0)}`}
            danger
          />
          <Metric
            title="Inventory Value"
            value={`$${inventoryValue.toFixed(0)}`}
          />
        </div>

        {/* CHART + PAYMENT METHODS */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">
              Revenue (Last 6 Months)
            </h2>
            <RevenueChart data={revenueChartData} />
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>

            <div className="space-y-3">
              {Object.entries(paymentMethods).length === 0 && (
                <p className="text-sm text-gray-500">No payment data yet.</p>
              )}

              {Object.entries(paymentMethods).map(([method, count]) => (
                <div key={method} className="flex justify-between text-sm">
                  <span>{method}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INVENTORY HEALTH + TOP PRODUCTS */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Inventory Health</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Low Stock</span>
                <span>{lowStockCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Out of Stock</span>
                <span>{outOfStockCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>

            <div className="space-y-3">
              {topProducts.length === 0 && (
                <p className="text-sm text-gray-500">No sales yet.</p>
              )}

              {topProducts.map((product, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span>{product.qty} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({
  title,
  value,
  danger,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border text-center">
      <div className="text-sm text-gray-600">{title}</div>
      <div className={`text-2xl font-bold ${danger ? "text-red-600" : ""}`}>
        {value}
      </div>
    </div>
  );
}
