
import SummaryDashboardView from "../../Views/SummaryDash"
import PageMeta from "../../components/common/PageMeta"

const SummaryDashboardPage = () => {
  return (
    <>
      <PageMeta
        title="Summary Dashboard | SCM Dashboard"
        description="Summary Dashboard for SCM"
      />
      <div className="w-full max-w-full overflow-hidden">
        <SummaryDashboardView />
      </div>
    </>
  )
}

export default SummaryDashboardPage