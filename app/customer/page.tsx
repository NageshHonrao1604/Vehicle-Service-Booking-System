import { DashboardShell } from "@/components/dashboard-shell"
import { CustomerDashboard } from "@/components/customer-dashboard"

export default function CustomerPage() {
  return (
    <DashboardShell role="customer" title="Customer Portal">
      <CustomerDashboard />
    </DashboardShell>
  )
}
