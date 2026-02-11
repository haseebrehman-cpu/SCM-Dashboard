import { useState, useCallback } from 'react';
import { Container, EditableFields } from '../types/purchaseOrder';

interface UseInlineEditReturn {
  editingRowId: number | null;
  editedData: EditableFields | null;
  isEditing: (rowId: number) => boolean;
  startEdit: (row: Container) => void;
  saveEdit: (userEmail?: string) => void;
  cancelEdit: () => void;
  updateEditedData: (updates: Partial<EditableFields>) => void;
}

export const useInlineEdit = (
  setTableData: React.Dispatch<React.SetStateAction<Container[]>>
): UseInlineEditReturn => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<EditableFields | null>(null);

  const isEditing = useCallback((rowId: number) => editingRowId === rowId, [editingRowId]);

  const startEdit = useCallback((row: Container) => {
    setEditingRowId(row.id);
    setEditedData({
      arrivalDate: row.arrivalDate,
      deliveryStatus: row.deliveryStatus,
      editedBy: row.editedBy,
    });
  }, []);

  const saveEdit = useCallback((userEmail?: string) => {
    if (editingRowId !== null && editedData) {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === editingRowId ? { ...row, ...editedData, editedBy: userEmail || row.editedBy } : row
        )
      );
      setEditingRowId(null);
      setEditedData(null);
    }
  }, [editingRowId, editedData, setTableData]);

  const cancelEdit = useCallback(() => {
    setEditingRowId(null);
    setEditedData(null);
  }, []);

  const updateEditedData = useCallback((updates: Partial<EditableFields>) => {
    setEditedData((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return {
    editingRowId,
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  };
};
