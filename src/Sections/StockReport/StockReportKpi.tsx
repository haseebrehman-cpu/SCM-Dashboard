import KpiCards from '../../components/common/KpiCards'
import { useStockKpis } from '../../api/stockReportCharts'
import { ChartFilters } from '../../api/stockReportCharts'

interface StockReportKpiProps {
  filters?: ChartFilters;
}

const StockReportKpi = ({ filters }: StockReportKpiProps) => {
  const { data: kpiResponse, isLoading } = useStockKpis(filters);
  const kpiData = kpiResponse?.data;

  const kpiCards = [
    {
      metric: "SKU Count", //How many products do we carry?
      value: kpiData?.sku_count.toLocaleString() || "0",
      change: "",
      icon: "📦",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      des: "No of unique ItemNumbers"
    },
    {
      metric: "Total Quantity Sold", //How many items are sold?
      value: kpiData?.total_sold.toLocaleString() || "0",
      change: "",
      icon: "📊",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      des: "Sold Quantity (Last 60 days)"
    },
    {
      metric: "Total Warehouse Stock",  //How many total items do we have?
      value: kpiData?.total_stock.toLocaleString() || "0",
      change: "",
      icon: "📉",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      des: "Sum of Available Items"
    },
    {
      metric: "Abundant Items Count", //How many abundant items we have?
      value: kpiData?.abandoned_items_count.toLocaleString() || "0",
      change: "",
      icon: "📉",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      des: "Total count for abandoned items"
    },
  ];

  // if (isLoading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  //       {[1, 2, 3, 4].map((i) => (
  //         <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((item, index) => (
        <KpiCards key={index} kpiInfo={item} loading={isLoading}/>
      ))}
    </div>
  )
}

export default StockReportKpi