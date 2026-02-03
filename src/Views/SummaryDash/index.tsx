import SummaryDashGrid from '../../Sections/SummaryDash/SummaryDash'
import PageMeta from '../../components/common/PageMeta'

const SummaryDashboardView = () => {
  return (
    <>
      <PageMeta
        title="Summary Dashboard | SCM Dashboard"
        description="Summary Dashboard"
      />
      <div className="w-full max-w-full overflow-hidden">
        <SummaryDashGrid />
      </div>
    </>
  )
}

export default SummaryDashboardView