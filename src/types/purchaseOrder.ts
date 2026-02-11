export type DeliveryStatus = "Delivered" | "InTransit";

export interface Container {
  id: number;
  containerName: string;
  referenceContainer: string;
  containerNumber: string;
  containerRegion: string;
  departureDate: string;
  arrivalDate: string;
  deliveryStatus: DeliveryStatus;
  editedBy?: string;
}

export interface EditableFields {
  arrivalDate: string;
  deliveryStatus: DeliveryStatus;
  editedBy?: string;
}
