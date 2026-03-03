export interface WHContainerReportRow {
  id: number;
  WareHouseCode: string | null;
  CategoryName: string;
  ItemNumber: string;
  ContainerName: string;
  IntransitQuantity: number;
  ContainerRegion: string;
  ContainerNumber: number;
  DepartureDate: string;
  ArrivalDate: string;
  LeftDays: number;
  UploadDate: string;
}
