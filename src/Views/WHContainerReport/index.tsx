import WHContainerKPI from "../../Sections/WHContainerReport/WHContainerKPI"
import ContainerLoadAnalysis from "../../Sections/WHContainerReport/ContainerLoadAnalysis"
import WHContainerGrid from "../../Sections/WHContainerReport/WHContainerGrid"

const WHContainerReportView = () => {
  return (
    <div>
      <WHContainerKPI />
      <ContainerLoadAnalysis />
      <WHContainerGrid />
    </div>
  )
}

export default WHContainerReportView