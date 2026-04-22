import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useEffect } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import React from "react";
import { useSummaryEdit } from "../../hooks/useSummaryEdit";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import ArchieveDialog from "./ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useGridFilterCount } from "../../hooks/useGridFilterCount";
import { Warehouse } from "../../types/common";
import { SelectChangeEvent } from "@mui/material";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import { useSummaryDashboardData } from "../../hooks/useSummaryDashboardData";
import { usePatchSummaryDashboard } from "../../api/stockPerfomance";
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";

const SummaryDashGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sessionId = useLatestSessionId();

  const [rows, setRows] = useState<SummaryDashboardRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");
  const ALL_VALUE = -1;
  const [editingField, setEditingField] = useState<
    "status" | "factory_comment" | null
  >(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 500,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);

  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const {
    rows: summaryRows,
    rowCount,
    isLoading,
    refetchSummary,
  } = useSummaryDashboardData({
    selectedWarehouse,
    sessionId,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  useEffect(() => {
    setRows(summaryRows);
  }, [summaryRows]);

  const { mutate: patchSummaryDashboardMutation } = usePatchSummaryDashboard();

  const {
    editingRowId,
    editValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleStatusChange,
    handleCommentsChange,
  } = useSummaryEdit(setRows, patchSummaryDashboardMutation, refetchSummary);

  const editableColumnsOnDoubleClick = ["status", "factory_comment"];

  const startEdit = (id: number, field: "status" | "factory_comment") => {
    setEditingField(field);
    handleEdit(id, rows);
  };

  const startRowEdit = (id: number) => {
    setEditingField(null);
    handleEdit(id, rows);
  };

  const handleSaveWithFieldReset = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    handleSave(id, row.warehouse_code);
    setEditingField(null);
  };

  const handleCancelWithFieldReset = () => {
    handleCancel();
    setEditingField(null);
  };

  const handleCellDoubleClick = (params: any) => {
    if (!editableColumnsOnDoubleClick.includes(params.field)) return;
    if (editingRowId !== null) return;
    startEdit(
      params.id as number,
      params.field as "status" | "factory_comment",
    );
  };

  const columns = useMemo(() => {
    return createSummaryDashboardColumns(
      isDark,
      editingRowId,
      editingField,
      editValues,
      handleStatusChange,
      handleCommentsChange,
      startRowEdit,
      handleSaveWithFieldReset,
      handleCancelWithFieldReset,
    );
  }, [
    isDark,
    editingRowId,
    editingField,
    editValues,
    handleStatusChange,
    handleCommentsChange,
    handleSaveWithFieldReset,
    handleCancelWithFieldReset,
  ]);

  const isAnyLoading = isLoading || isChangingPage;
  const { apiRef, filterModel, onFilterModelChange, getFilteredRowCount } =
    useGridFilterCount();

  const handleFileUpload = async (file: File) => {};

  return (
    <>
      <div className="flex justify-end my-4">
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          isArchived={true}
          isSelectWarehouse={true}
          isShowUpload={true}
          onArchiveClick={() => setIsDialogOpen(true)}
          onUploadClick={() => setIsUploadDialogOpen(true)}
        />
      </div>
      <div className="p-3 bg-[#047ADB]/10 dark:bg-[#047ADB]/20 border border-[#047ADB]/20 dark:border-[#047ADB]/40 rounded-lg mb-4">
        {isUploadDialogOpen && (
          <FileUploadDialog
            isOpen={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            onUpload={handleFileUpload}
          />
        )}
        <p className="text-sm font-semibold text-[#047ADB] dark:text-white">
          ⓘ &nbsp; Information
        </p>
        <p className="text-xs text-[#047ADB] dark:text-white mt-2">
          Click the Load Report Button in the Stock Performance Report to
          Generate the Report.
        </p>
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">
        <BrandedLogoLoader
          isLoading={isAnyLoading}
          isDark={isDark}
          message="Loading Summary Dashboard"
        />

        {isDialogOpen && (
          <>
            <ArchieveDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          </>
        )}

        <DataGridPremium
          apiRef={apiRef}
          label="Summary Dashboard Report"
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={onFilterModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onCellDoubleClick={handleCellDoubleClick}
          paginationMode="server"
          columnVisibilityModel={{ id: false }}
          rowCount={getFilteredRowCount(rowCount)}
          pageSizeOptions={[
            500,
            1000,
            5000,
            { value: ALL_VALUE, label: `Show All` },
          ]}
          pagination
          rowBufferPx={100}
          loading={isAnyLoading}
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark)}
          showToolbar
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              excelOptions: { disableToolbarButton: true },
              csvOptions: {
                disableToolbarButton: false,
                escapeFormulas: false,
                fileName: `${selectedWarehouse}_Summary_Dashboard_SCM_Dashboard`,
                allColumns: true,
              },
            },
          }}
        />
      </div>
    </>
  );
});

export default SummaryDashGrid;
