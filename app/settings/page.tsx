import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
  await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/settings" />
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-500">
                Manage your account settings and preferences.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
            <AccountSettings fullPage />
          </div>
        </div>
      </main>
    </div>
  );
}
