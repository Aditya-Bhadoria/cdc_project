import { db } from "../../../lib/db";
import { User, Shield, Store } from "lucide-react";
import { ProfileForm } from "../../../components/settings/profile-form";
import { PasswordForm } from "../../../components/settings/password-form";
import { LogoutButton } from "../../../components/dashboard/logout-button"; 

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await db.user.findFirst();

  if (!user) {
    return <div className="text-white">User not found. Please run the seed script.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account preferences and store configuration.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
              <p className="text-sm text-slate-400">Update your personal information</p>
            </div>
          </div>
          <ProfileForm initialName={user.name || ""} email={user.email} />
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
           <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Store className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Store Preferences</h2>
              <p className="text-sm text-slate-400">Manage how your inventory is displayed</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-800">
              <div>
                <p className="font-medium text-slate-200">Low Stock Alerts</p>
                <p className="text-sm text-slate-500">Get notified when items drop below 10 units</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-200">Strict Mode</p>
                <p className="text-sm text-slate-500">Prevent archiving items with active inventory</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
           <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-slate-400">Manage your password</p>
            </div>
          </div>
          
          <PasswordForm email={user.email} />
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex items-center justify-between">
           <div>
              <h2 className="text-lg font-semibold text-white">Sign Out</h2>
              <p className="text-sm text-slate-400">Securely log out of your session</p>
           </div>
           <LogoutButton />
        </div>

      </div>
    </div>
  );
}