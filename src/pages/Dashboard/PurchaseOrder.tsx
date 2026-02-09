import PurchaseOrder from '../../Sections/PurchaseOrderGrid/PurchaseOrder'
import PageMeta from '../../components/common/PageMeta'

const PurchaseOrderPage = () => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <PageMeta
        title="Purchase Order | SCM Dashboard"
        description="Purchase Order"
      />
      <PurchaseOrder />
    </div>
  )
}

export default PurchaseOrderPage