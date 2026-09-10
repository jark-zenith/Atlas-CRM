import Header from '@/components/Header'
import { Card, Button } from '@/components/UI'

export default function Settings() {
  return (
    <div>
      <Header title="Settings" subtitle="Manage your preferences" />
      <main className="ml-64 p-8">
        <div className="max-w-2xl">
          {/* Profile Section */}
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                defaultValue="Your Company"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button>Save Profile</Button>
          </Card>

          {/* Security Section */}
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button>Update Password</Button>
          </Card>

          {/* Preferences Section */}
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="notifications" className="ml-3 text-gray-700">
                  Enable email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing"
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="marketing" className="ml-3 text-gray-700">
                  Receive marketing emails
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminders"
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="reminders" className="ml-3 text-gray-700">
                  Task reminders
                </label>
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Preferences</Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-900 mb-6">Danger Zone</h2>
            <p className="text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger">Delete Account</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
