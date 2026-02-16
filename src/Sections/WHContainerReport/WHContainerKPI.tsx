import KpiCards from '../../components/common/KpiCards'

const kpiCards = [
  {
    metric: "Total Containers Count", //How much containers we have?
    value: "1,847",
    change: "+8.2%",
    icon: "📦",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    des: "Total No of Containers"
  },
  {
    metric: "Intransit Containers", //How many Containers are not delivered yet?
    value: "2,847",
    change: "+8.2%",
    icon: "📦",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    des: "No of Intransit Containers"
  },
  {
    metric: "Delivered Containers",  //How many total containers delivered?
    value: "523",
    change: "+7.4%",
    icon: "📉",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    des: "No of Containers Delivered"
  },
  {
    metric: "Intransit Quantity Count", //How much intransict quantity we have?
    value: "5523",
    change: "+7.4%",
    icon: "📉",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    des: "Total Count of Intransit Containers"
  },
];

const WHContainerKPI = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((item, index) => (
        <KpiCards key={index} kpiInfo={item} />
      ))}
    </div>
  )
}

export default WHContainerKPI