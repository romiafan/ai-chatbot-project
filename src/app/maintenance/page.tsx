import { Construction } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full">
              <Construction className="w-16 h-16 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Under Maintenance
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            We're currently performing scheduled maintenance to improve your
            experience. We'll be back online shortly.
          </p>

          <div className="pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expected return: <span className="font-semibold">Soon</span>
            </p>
          </div>

          <div className="pt-2">
            <a
              href="mailto:slwtyprdev@gmail.com"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
