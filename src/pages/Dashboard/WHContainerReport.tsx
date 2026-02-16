import WHContainerReportView from "../../Views/WHContainerReport";
import PageMeta from "../../components/common/PageMeta";

const WHContainerReport = () => {

  return (
    <div>
       <PageMeta
        title="Warehouse Container Report | SCM Dashboard"
        description="View your Warehouse Container Report"
      />
      <WHContainerReportView />
    </div>
  )
}

export default WHContainerReport