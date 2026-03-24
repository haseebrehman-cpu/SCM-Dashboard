import { useEffect, useRef } from "react";
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

  const production_remaining_report = prodData?.production_remaining_report ?? false;
  const container_report = containerData?.container_report ?? false;

  // Refs to track previous values
  const prevProdReportRef = useRef(production_remaining_report);
  const prevContainerReportRef = useRef(container_report);

  useEffect(() => {
    // Check if values have changed
    const prodReportChanged = prevProdReportRef.current !== production_remaining_report;
    const containerReportChanged = prevContainerReportRef.current !== container_report;

    // Update refs with current values
    prevProdReportRef.current = production_remaining_report;
    prevContainerReportRef.current = container_report;

    // If either value changed and session_id exists, refetch the APIs
    if ((prodReportChanged || containerReportChanged) && session_id !== null) {
      refetchProd();
      refetchContainer();
    }
  }, [production_remaining_report, container_report, session_id, refetchProd, refetchContainer]);

  const isButtonDisabled = container_report === true || production_remaining_report === false;

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