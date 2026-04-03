import { useState, useCallback } from 'react';
import { SummaryDashboardRow } from '../config/summaryDashboard';

interface EditValues {
  status: string;
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
  factory_comment: string;
}

type PatchSummaryDashboardMutation = (variables: {
  id: number;
  status: string;
  factory_comment: string;
  warehouse_code: string;
  signal?: AbortSignal;
}) => void;

interface UseSummaryEditReturn {
  editingRowId: number | null;
  editValues: EditValues | null;
  handleEdit: (id: number, rows: SummaryDashboardRow[]) => void;
  handleSave: (id: number, warehouse_code: string) => void;
  handleCancel: () => void;
  handleStatusChange: (value: string) => void;
  handleCommentsChange: (value: string) => void;
}

export const useSummaryEdit = (
  setRows: React.Dispatch<React.SetStateAction<SummaryDashboardRow[]>>,
  patchSummaryDashboardMutation: PatchSummaryDashboardMutation
): UseSummaryEditReturn => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues | null>(null);

  const handleEdit = useCallback((id: number, rows: SummaryDashboardRow[]) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditingRowId(id);
      setEditValues({
        status: row.status,
        reason1: row.reason1 || '',
        reason2: row.reason2 || '',
        reason3: row.reason3 || '',
        reason4: row.reason4 || '',
        factory_comment: row.factory_comment || '',
      });
    }
  }, []);

  const handleSave = useCallback((id: number, warehouse_code: string) => {
    if (editValues) {
      patchSummaryDashboardMutation({
        id,
        status: editValues.status,
        factory_comment: editValues.factory_comment,
        warehouse_code,
      });

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
              ...row,
              status: editValues.status,
              reason1: editValues.reason1,
              reason2: editValues.reason2,
              reason3: editValues.reason3,
              reason4: editValues.reason4,
              factory_comment: editValues.factory_comment,
            }
            : row
        )
      );
      setEditingRowId(null);
      setEditValues(null);
    }
  }, [editValues, patchSummaryDashboardMutation, setRows]);

  const handleCancel = useCallback(() => {
    setEditingRowId(null);
    setEditValues(null);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, status: value } : null);
  }, []);


  const handleCommentsChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, factory_comment: value } : null);
  }, []);

  return {
    editingRowId,
    editValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleStatusChange,
    handleCommentsChange,
  };
};
