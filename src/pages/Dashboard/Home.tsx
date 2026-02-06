import PageMeta from "../../components/common/PageMeta";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/common/Badge";

interface DashboardMetric {
  title: string;
  value: string | number;
  subtitle: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

const dashboardMetrics: DashboardMetric[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    subtitle: "From 1 Jan to 31 Dec",
    trend: { value: 20.1, isPositive: true },
    icon: (
      <svg
        className="h-6 w-6 text-brand-600 dark:text-brand-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Total Orders",
    value: "1,234",
    subtitle: "This month",
    trend: { value: 15.3, isPositive: true },
    icon: (
      <svg
        className="h-6 w-6 text-brand-600 dark:text-brand-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    title: "Active Users",
    value: "8,234",
    subtitle: "Currently online",
    trend: { value: 2.5, isPositive: true },
    icon: (
      <svg
        className="h-6 w-6 text-brand-600 dark:text-brand-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    subtitle: "vs 2.89% last month",
    trend: { value: 5.2, isPositive: true },
    icon: (
      <svg
        className="h-6 w-6 text-brand-600 dark:text-brand-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8L5.257 19.547M5 7H3m0 0v8"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | LWH - Admin Dashboard"
        description="Welcome to your LWH admin dashboard. Manage your business metrics and analytics in one place."
      />

      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          title="Welcome back! 👋"
          description="Here's what's happening with your business today."
        />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <StatCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              trend={metric.trend}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <a
                href="#"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                View all
              </a>
            </div>

            <div className="space-y-4">
              {[
                { action: "New order received", time: "2 minutes ago", badge: "new" },
                { action: "Payment processed", time: "15 minutes ago", badge: "success" },
                { action: "Shipment delivered", time: "1 hour ago", badge: "info" },
                { action: "Customer feedback received", time: "3 hours ago", badge: "info" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </p>
                  </div>
                  <Badge variant={item.badge === "new" ? "info" : (item.badge as "success" | "info")}>
                    {item.badge === "new"
                      ? "New"
                      : item.badge === "success"
                        ? "Success"
                        : "Info"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                Create Order
              </Button>
              <Button variant="outline" className="w-full">
                Download Report
              </Button>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-6 rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
              <p className="text-xs font-medium text-brand-900 dark:text-brand-200">
                💡 Pro Tip
              </p>
              <p className="mt-1 text-xs text-brand-800 dark:text-brand-300">
                Use keyboard shortcuts to navigate faster. Press "?" to see all shortcuts.
              </p>
            </div>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Overview
            </h3>
            <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Page Views", value: "45,231", change: "+12.5%" },
              { label: "Sessions", value: "8,234", change: "+8.2%" },
              { label: "Bounce Rate", value: "32.5%", change: "-2.1%" },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-success-600 dark:text-success-400">
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
