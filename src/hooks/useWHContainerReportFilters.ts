import { useCallback, useMemo, useState } from "react";
import { useLatestSessionId } from "./useLatestSessionId";
import { useFilterOptions } from "../api/containerDetailReport";
import type { ContainerReportFilters } from "../api/containerDetailReport";

type WHContainerFiltersState = {
  warehouse: string[];
  category: string[];
  container_name: string[];
  sku: string[];
};

type FiltersArrayItem = {
  id: keyof WHContainerFiltersState;
  filterName: string;
  filterOptions: string[];
};

export const useWHContainerReportFilters = () => {
  const sessionId = useLatestSessionId();

  const [filters, setFilters] = useState<WHContainerFiltersState>({
    warehouse: [],
    category: [],
    container_name: [],
    sku: [],
  });

  const {
    data: filterOptionsData,
    isLoading,
  } = useFilterOptions("container", sessionId, filters as ContainerReportFilters);

  const [appliedFilters, setAppliedFilters] = useState<WHContainerFiltersState>({
    warehouse: [],
    category: [],
    container_name: [],
    sku: [],
  });

  const filtersArray: FiltersArrayItem[] = useMemo(
    () => [
      {
        id: "warehouse",
        filterName: "Select Warehouse",
        filterOptions: filterOptionsData?.filter_options.warehouse || [],
      },
      {
        id: "category",
        filterName: "Select Category",
        filterOptions: filterOptionsData?.filter_options.category || [],
      },
      {
        id: "container_name",
        filterName: "Select Container Name",
        filterOptions:
          filterOptionsData?.filter_options.container_name || [],
      },
      {
        id: "sku",
        filterName: "Select SKU",
        filterOptions: filterOptionsData?.filter_options.sku || [],
      },
    ],
    [filterOptionsData],
  );

  const handleChange = useCallback(
    (id: FiltersArrayItem["id"]) => (value: string[]) => {
      setFilters((prev) => ({ ...prev, [id]: value }));
    },
    [],
  );

  const hasFilters = useMemo(
    () => Object.values(filters).some((arr) => arr.length > 0),
    [filters],
  );

  const handleApplyFilter = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const handleCancel = useCallback(() => {
    setFilters({
      warehouse: [],
      category: [],
      container_name: [],
      sku: [],
    });
    setAppliedFilters({
      warehouse: [],
      category: [],
      container_name: [],
      sku: [],
    });
  }, []);

  const handleDeleteFilter = useCallback(
    (category: string, value: string) => {
      setAppliedFilters((prev) => {
        const updated = {
          ...prev,
          [category]: (prev as Record<string, string[]>)[category].filter(
            (v) => v !== value,
          ),
        } as WHContainerFiltersState;

        // Keep unapplied filters in sync with applied state.
        setFilters(updated);
        return updated;
      });
    },
    [],
  );

  const handleClearAll = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  return {
    sessionId,
    filters,
    appliedFilters,
    isLoading,
    filtersArray,
    hasFilters,
    handleChange,
    handleApplyFilter,
    handleCancel,
    handleDeleteFilter,
    handleClearAll,
  };
};

