
import SummaryDashboardView from "../../Views/SummaryDash"
import PageMeta from "../../components/common/PageMeta"

const SummaryDashboardPage = () => {
  return (
    <>
      <PageMeta
        title="Summary Dashboard | Linworks"
        description="Summary Dashboard for Linworks"
      />
      <div className="w-full max-w-full overflow-hidden">
        <SummaryDashboardView />
      </div>
    </>
  )
}

export default SummaryDashboardPage