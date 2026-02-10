import StockPerformanceView from '../../Views/StockPerformance'
import PageMeta from '../../components/common/PageMeta'

const StockPerformanceReport = () => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <PageMeta
        title="Stock Performance Report | SCM Dashboard"
        description="Stock Performance Report"
      />
      <StockPerformanceView />
    </div>
  )
}

export default StockPerformanceReport