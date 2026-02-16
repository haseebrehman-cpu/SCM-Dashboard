import WHContainerKPI from "../../Sections/WHContainerReport/WHContainerKPI"
import ContainerLoadAnalysis from "../../Sections/WHContainerReport/ContainerLoadAnalysis"

const WHContainerReportView = () => {
  return (
    <div>
      <WHContainerKPI />
      <ContainerLoadAnalysis />
    </div>
  )
}

export default WHContainerReportView