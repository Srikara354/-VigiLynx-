import { motion } from 'framer-motion';

const Reports = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Security Reports
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Comprehensive analysis of your security status and threats
            </p>
          </div>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Generate Report
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Report Cards */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Threat Analysis</h3>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Safe
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Last updated: 2 hours ago
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Vulnerability Scan</h3>
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                Warning
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Last updated: 1 day ago
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Optimal
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Last updated: 3 hours ago
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;