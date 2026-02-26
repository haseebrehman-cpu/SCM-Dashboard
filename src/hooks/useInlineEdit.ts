import { useState, useCallback } from 'react';
import { EditableFields } from '../types/purchaseOrder';
import { PurchaseOrderData } from '../types/Interfaces/interfaces';

interface UseInlineEditReturn {
  editingRowId: number | null;
  editedData: EditableFields | null;
  isEditing: (rowId: number) => boolean;
  startEdit: (row: PurchaseOrderData) => void;
  saveEdit: (userEmail?: string) => void;
  cancelEdit: () => void;
  updateEditedData: (updates: Partial<EditableFields>) => void;
}

export const useInlineEdit = (
): UseInlineEditReturn => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<EditableFields | null>(null);

  const isEditing = useCallback((rowId: number) => editingRowId === rowId, [editingRowId]);

  const startEdit = useCallback((row: PurchaseOrderData) => {
    setEditingRowId(row.id);
    setEditedData({
      arrivalDate: row.arrival_date ?? "",
      deliveryStatus: row.delivery_status === "Delivered" ? "Delivered" : "InTransit",
      editedBy: row.modified_by,
    });
  }, []);

  const saveEdit = useCallback(() => {
    if (editingRowId !== null && editedData) {
      setEditingRowId(null);
      setEditedData(null);
    }
  }, [editingRowId, editedData]);

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
