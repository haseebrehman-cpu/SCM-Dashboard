
import CombinedReportGrid from '../../Sections/CombinedReport/CombinedReport';
import PageMeta from '../../components/common/PageMeta';

const CombinedReport = () => {
  return (
    <div>
      <PageMeta
        title="Combined Report | SCM - Dashboard"
        description="This is Combined Report page for SCM"
      />
      <CombinedReportGrid />
    </div>
  )
}

export default CombinedReport