import { useState, useCallback } from 'react';
import { GridFilterModel, gridFilteredTopLevelRowCountSelector, useGridApiRef } from '@mui/x-data-grid-premium';

export const useGridFilterCount = (externalApiRef?: React.MutableRefObject<any>) => {
  const internalApiRef = useGridApiRef();
  const apiRef = externalApiRef || internalApiRef;

  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [visibleRowCount, setVisibleRowCount] = useState<number>(0);

  const onFilterModelChange = useCallback((newModel: GridFilterModel) => {
    setFilterModel(newModel);
    
    setTimeout(() => {
      if (apiRef.current) {
        try {
          setVisibleRowCount(gridFilteredTopLevelRowCountSelector(apiRef));
        } catch (e) {
          const items = apiRef.current.state?.filter?.filteredRowsLookup;
          if (items) {
            setVisibleRowCount(Object.values(items).filter(Boolean).length);
          }
        }
      }
    }, 50);
  }, [apiRef]);

  const getFilteredRowCount = useCallback((defaultTotalCount: number) => {
    return filterModel.items?.length > 0 ? visibleRowCount : defaultTotalCount;
  }, [filterModel.items?.length, visibleRowCount]);

  return {
    apiRef,
    filterModel,
    onFilterModelChange,
    getFilteredRowCount,
  };
};
