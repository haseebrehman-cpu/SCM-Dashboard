export interface ContainerLoadData {
  containerNumber: string;
  categoryName: string;
  value: number;
}

export const containerLoadData: ContainerLoadData[] = [
  { containerNumber: 'CSNU1234567', categoryName: 'Electronics', value: 450 },
  { containerNumber: 'CSNU1234567', categoryName: 'Fashion', value: 300 },
  { containerNumber: 'CSNU1234567', categoryName: 'Home & Garden', value: 150 },
  { containerNumber: 'MSCU9876543', categoryName: 'Electronics', value: 600 },
  { containerNumber: 'MSCU9876543', categoryName: 'Toys', value: 400 },
  { containerNumber: 'HLCU5551234', categoryName: 'Fashion', value: 500 },
  { containerNumber: 'HLCU5551234', categoryName: 'Beauty', value: 250 },
  { containerNumber: 'HLCU5551234', categoryName: 'Sports', value: 350 },
  { containerNumber: 'TCLU7778889', categoryName: 'Electronics', value: 200 },
  { containerNumber: 'TCLU7778889', categoryName: 'Home & Garden', value: 800 },
  { containerNumber: 'OOLU3334445', categoryName: 'Books', value: 700 },
  { containerNumber: 'OOLU3334445', categoryName: 'Electronics', value: 400 },
  { containerNumber: 'S-700', categoryName: 'Automotive', value: 900 },
  { containerNumber: 'S-700', categoryName: 'Electronics', value: 300 },
  { containerNumber: 'DE-701', categoryName: 'Clothing & Accessories', value: 550 },
  { containerNumber: 'DE-701', categoryName: 'Health & Beauty', value: 450 },
];
