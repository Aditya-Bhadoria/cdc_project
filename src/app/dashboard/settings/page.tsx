import { db } from "../../../lib/db";
import { User, Shield, Store } from "lucide-react";
import { ProfileForm } from "../../../components/settings/profile-form";
import { PasswordForm } from "../../../components/settings/password-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await db.user.findFirst();

  if (!user) {
    return <div>User not found. Please run the seed script.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences and store configuration.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </div>
          <ProfileForm initialName={user.name || ""} email={user.email} />
        </div>

        {/* Store Preferences (Restored UI) */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
           <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Store Preferences</h2>
              <p className="text-sm text-gray-500">Manage how your inventory is displayed</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Low Stock Alerts</p>
                <p className="text-sm text-gray-500">Get notified when items drop below 10 units</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Strict Mode</p>
                <p className="text-sm text-gray-500">Prevent archiving items with active inventory</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
           <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage your password</p>
            </div>
          </div>
          
          <PasswordForm email={user.email} />
        </div>
      </div>
    </div>
  );
}