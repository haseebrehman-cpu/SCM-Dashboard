import { useEffect } from "react";
import { useProductionRemainingReport } from "../api/productionRemainingReport";
import { useCombinedReport } from "../api/containerDetailReport";

/**
 * Hook to check if the 'Load Reports' button should be disabled based on report flags.
 * React Query automatically refetches when warehouse_region or session_id change due to queryKey,
 * but an explicit useEffect is added as requested to ensure rerunning on value changes.
 */
export const useLoadReportflagCheck = (warehouse_region: string, session_id: number | null) => {
  const {
    data: prodData,
    isLoading: prodLoading,
    refetch: refetchProd
  } = useProductionRemainingReport(warehouse_region, session_id);

  const {
    data: containerData,
    isLoading: containerLoading,
    refetch: refetchContainer
  } = useCombinedReport(1, 100, session_id);

  const production_remaining_report = prodData?.production_remaining_report ?? true;
  const container_report = containerData?.container_report ?? true;

  useEffect(() => {
    if (session_id !== null) {
      refetchProd();
      refetchContainer();
    }
  }, [warehouse_region, session_id, refetchProd, refetchContainer, container_report]);

  const isButtonDisabled = container_report === false;

  return {
    isButtonDisabled,
    isLoading: prodLoading || containerLoading,
    production_remaining_report,
    container_report,
    refetchAll: () => {
      refetchProd();
      refetchContainer();
    }
  };
};
