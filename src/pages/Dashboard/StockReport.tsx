import StockReportView from '../../Views/StockReport';
import PageMeta from '../../components/common/PageMeta';

const StockReport = () => {
  return (
    <div>
       <PageMeta
        title="Stock Report | SCM Dashboard"
        description="View your stock reports"
      />
      <StockReportView />
    </div>
  )
}

export default StockReport