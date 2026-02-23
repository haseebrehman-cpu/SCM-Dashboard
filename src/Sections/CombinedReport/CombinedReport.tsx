import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { useMemo } from "react";
import { combinedReportData } from '../../mockData/combinedReportMock';
import { generateCombinedReportColumns } from '../../utils/columnGenerators/combinedReport';

const COMBINED_REPORT_PAGINATION = {
  paginationModel: { page: 0, pageSize: 100 }
};

const CombinedReportGrid = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const columns = useMemo(() =>
    generateCombinedReportColumns({ isDark }),
    [isDark]
  );

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <DataGridPremium
        label="Combined Report"
        rows={combinedReportData}
        columns={columns}
        initialState={{ pagination: { paginationModel: COMBINED_REPORT_PAGINATION.paginationModel } }}
        pageSizeOptions={[100, 200, 500]}
        pagination
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark, "auto")}
        rowBufferPx={100}
        columnHeaderHeight={56}
        showToolbar
      />
    </div>
  )
}

export default CombinedReportGrid