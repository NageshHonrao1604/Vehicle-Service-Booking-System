import { DashboardShell } from "@/components/dashboard-shell"
import { MechanicDashboard } from "@/components/mechanic-dashboard"

export default function MechanicPage() {
  return (
    <DashboardShell role="mechanic" title="Mechanic Console">
      <MechanicDashboard />
    </DashboardShell>
  )
}
