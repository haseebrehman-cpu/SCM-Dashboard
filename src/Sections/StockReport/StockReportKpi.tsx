import KpiCards from './KpiCards'

const kpiCards = [
  {
    metric: "SKU Count", //How many products do we carry?
    value: "2,847",
    change: "+8.2%",
    icon: "📦",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    des: "No of unique ItemNumbers"
  },
  {
    metric: "Total Quantity Sold", //How many items are sold?
    value: "154.9K",
    change: "-4.7%",
    icon: "📊",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    des: "Overall Sold Quantity"
  },
  {
    metric: "Total Warehouse Stock",  //How many total items do we have?
    value: "523",
    change: "+7.4%",
    icon: "📉",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    des: "Sum of Available Items"
  },
  {
    metric: "Abundant Items Count", //How many abundant items we have?
    value: "523",
    change: "+7.4%",
    icon: "📉",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    des: "Count where Available is 0"
  },
];

const StockReportKpi = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((item, index) => (
        <KpiCards key={index} kpiInfo={item} />
      ))}
    </div>
  )
}

export default StockReportKpi