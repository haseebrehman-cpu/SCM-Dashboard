import { useState, useCallback } from 'react';
import { SummaryDashboardRow } from '../config/summaryDashboard';

interface EditValues {
  status: string;
  reason: string;
  factoryComments: string;
}

interface UseSummaryEditReturn {
  editingRowId: number | null;
  editValues: EditValues | null;
  handleEdit: (id: number, rows: SummaryDashboardRow[]) => void;
  handleSave: (id: number) => void;
  handleCancel: () => void;
  handleStatusChange: (value: string) => void;
  handleReasonChange: (value: string) => void;
  handleCommentsChange: (value: string) => void;
}

export const useSummaryEdit = (
  setRows: React.Dispatch<React.SetStateAction<SummaryDashboardRow[]>>
): UseSummaryEditReturn => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues | null>(null);

  const handleEdit = useCallback((id: number, rows: SummaryDashboardRow[]) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditingRowId(id);
      setEditValues({
        status: row.status,
        reason: row.reason,
        factoryComments: row.factoryComments,
      });
    }
  }, []);

  const handleSave = useCallback((id: number) => {
    if (editValues) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
                ...row,
                status: editValues.status,
                reason: editValues.reason,
                factoryComments: editValues.factoryComments,
                editedBy: "haseeb.rehman@igate.com.pk"
              }
            : row
        )
      );
      setEditingRowId(null);
      setEditValues(null);
    }
  }, [editValues, setRows]);

  const handleCancel = useCallback(() => {
    setEditingRowId(null);
    setEditValues(null);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, status: value } : null);
  }, []);

  const handleReasonChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, reason: value } : null);
  }, []);

  const handleCommentsChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, factoryComments: value } : null);
  }, []);

  return {
    editingRowId,
    editValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleStatusChange,
    handleReasonChange,
    handleCommentsChange,
  };
};
