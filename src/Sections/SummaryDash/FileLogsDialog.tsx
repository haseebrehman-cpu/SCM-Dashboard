import React, { useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import {
  SummaryDashFileLogs,
  SummaryLogsData,
} from "../../types/Interfaces/interfaces";

interface FileLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void | Promise<void>;
  filelog?: SummaryDashFileLogs;
  loading: boolean;
}

const FileLogsDialog: React.FC<FileLogsDialogProps> = ({
  isOpen,
  onClose,
  filelog,
  loading,
}) => {
  const handleClose = () => {
    onClose();
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const rows = useMemo(() => {
    return filelog?.data || [];
  }, [filelog]);

  const columns = useMemo((): GridColDef<SummaryLogsData>[] => {
    return [
      {
        field: "id",
        headerName: "ID",
        flex: 0.5,
        minWidth: 60,
        sortable: true,
        filterable: true,
      },
      {
        field: "dashboard_id",
        headerName: "Dashboard ID",
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        field: "warehouse_code",
        headerName: "Warehouse",
        flex: 0.6,
        minWidth: 100,
        sortable: true,
        filterable: true,
      },
      {
        field: "field_name",
        headerName: "Field Name",
        flex: 1,
        minWidth: 140,
        sortable: true,
        filterable: true,
      },
      {
        field: "old_value",
        headerName: "Old Value",
        flex: 1,
        minWidth: 150,
        sortable: true,
        filterable: true,
        valueFormatter: (value) => (value as string | null) ?? "(empty)",
      },
      {
        field: "new_value",
        headerName: "New Value",
        flex: 1,
        minWidth: 150,
        sortable: true,
        filterable: true,
        valueFormatter: (value) => (value as string | null) ?? "(empty)",
      },
      {
        field: "changed_by",
        headerName: "Changed By",
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        field: "changed_at",
        headerName: "Changed At",
        flex: 1.2,
        minWidth: 200,
        sortable: true,
        filterable: true,
        valueFormatter: (value) => {
          if (!value) return "";
          const date = new Date(value);
          return date.toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
        },
      },
    ];
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose()}>
      <div className="flex flex-col max-w-6xl w-[1000px] mx-auto p-6 border-2 border-[#171E2E]">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Summary Dashboard File Logs Report
          </h2>
        </div>
        <div className="relative mb-6 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-xl overflow-hidden">
          <DataGridPremium
            rows={rows}
            columns={columns}
            label="Summary Logs"
            loading={loading}
            disablePivoting
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            pagination
            rowBufferPx={100}
            sx={getDataGridStyles(isDark, "600px")}
            showToolbar
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                excelOptions: { disableToolbarButton: true },
                csvOptions: {
                  disableToolbarButton: false,
                  fileName: "Summary_Dashboard_File_Logs",
                  utf8WithBom: true,
                },
              },
            }}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button onClick={() => handleClose()}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default FileLogsDialog;
