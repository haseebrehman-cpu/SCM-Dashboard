import { useState, useCallback } from "react";

/**
 * Custom hook for managing DataGrid row editing state
 * Follows Single Responsibility Principle - only handles editing logic
 */
export const useDataGridEditing = <T extends { id: number }>() => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<T> | null>(null);

  const handleEdit = useCallback((row: T) => {
    setEditingRowId(row.id);
    setEditValues(row);
  }, []);

  const handleSave = useCallback((id: number, updateRow: (row: T, values: Partial<T>) => T) => {
    if (editValues) {
      return (prevRows: T[]) =>
        prevRows.map((row) =>
          row.id === id ? updateRow(row, editValues) : row
        );
    }
    return (prevRows: T[]) => prevRows;
  }, [editValues]);

  const handleCancel = useCallback(() => {
    setEditingRowId(null);
    setEditValues(null);
  }, []);

  const updateEditValues = useCallback((values: Partial<T>) => {
    setEditValues((prev) => ({ ...prev, ...values }));
  }, []);

  const isEditing = useCallback((id: number) => {
    return editingRowId === id;
  }, [editingRowId]);

  return {
    editingRowId,
    editValues,
    handleEdit,
    handleSave,
    handleCancel,
    updateEditValues,
    isEditing,
  };
};
