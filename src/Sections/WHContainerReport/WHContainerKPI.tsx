import { useWarehouseKpi, ChartFilters } from '../../api/warehouseContainerReportChart';
import KpiCards from '../../components/common/KpiCards'

interface WHContainerKPIProps {
  filters?: ChartFilters;
  sessionId: number | null;
}

const WHContainerKPI = ({ filters, sessionId }: WHContainerKPIProps) => {
  const { data: kpiResponse, isLoading } = useWarehouseKpi(sessionId, filters);
  const kpiData = kpiResponse?.data;

  const kpiCards = [
    {
      metric: "Total Containers Count", //How much containers we have?
      value: kpiData?.total_containers?.toLocaleString() || "0",
      change: "+8.2%",
      icon: "📦",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      des: "Total No of Containers"
    },
    {
      metric: "Intransit Containers", //How many Containers are not delivered yet?
      value: kpiData?.intransit_containers?.toLocaleString() || "0",
      change: "+8.2%",
      icon: "📦",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      des: "No of Intransit Containers"
    },
    {
      metric: "Delivered Containers",  //How many total containers delivered?
      value: kpiData?.delivered_containers?.toLocaleString() || "0",
      change: "+7.4%",
      icon: "📉",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      des: "No of Containers Delivered"
    },
    {
      metric: "Intransit Quantity Count", //How much intransict quantity we have?
      value: kpiData?.total_intransit_quantity?.toLocaleString() || "0",
      change: "+7.4%",
      icon: "📉",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      des: "Total Intransit Containers"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((item, index) => (
        <KpiCards key={index} kpiInfo={item} loading={isLoading} />
      ))}
    </div>
  )
}

export default WHContainerKPI