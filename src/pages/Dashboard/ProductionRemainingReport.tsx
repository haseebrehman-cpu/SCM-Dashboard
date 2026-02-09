import ProductionRemainingView from '../../Views/ProductionReport'
import PageMeta from '../../components/common/PageMeta'

const ProductionRemainingReportPage = () => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <PageMeta
        title="Production Remaining Report | SCM Dashboard"
        description="Production Remaining Report"
      />
      <ProductionRemainingView />
    </div>
  )
}

export default ProductionRemainingReportPage