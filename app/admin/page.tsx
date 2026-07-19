import { DashboardShell } from "@/components/dashboard-shell"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <DashboardShell role="admin" title="Admin Console">
      <AdminDashboard />
    </DashboardShell>
  )
}
