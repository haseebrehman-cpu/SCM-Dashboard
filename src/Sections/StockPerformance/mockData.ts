import { Warehouse, ContainerInfo, StockPerformanceRow } from './types';

export const warehouseContainers: Record<Warehouse, ContainerInfo[]> = {
  UK: [
    { id: "S-700", date: "31-01-2026" },
    { id: "S-701", date: "31-01-2026" },
    { id: "S-703", date: "14-01-2026" },
    { id: "S-704", date: "21-02-2026" },
    { id: "S-705", date: "21-02-2026" },
    { id: "S-706", date: "22-02-2026" },
    { id: "S-707", date: "" },
    { id: "S-708", date: "" },
  ],
  DE: [
    { id: "D-400", date: "15-01-2026" },
    { id: "D-401", date: "20-01-2026" },
    { id: "D-402", date: "25-01-2026" },
    { id: "D-403", date: "01-02-2026" },
    { id: "D-404", date: "10-02-2026" },
    { id: "D-405", date: "" },
  ],
  US: [
    { id: "U-200", date: "05-01-2026" },
    { id: "U-201", date: "12-01-2026" },
    { id: "U-202", date: "18-01-2026" },
    { id: "U-203", date: "25-01-2026" },
    { id: "U-204", date: "01-02-2026" },
    { id: "U-205", date: "08-02-2026" },
    { id: "U-206", date: "15-02-2026" },
  ],
  CA: [
    { id: "C-100", date: "10-01-2026" },
    { id: "C-101", date: "20-01-2026" },
    { id: "C-102", date: "30-01-2026" },
    { id: "C-103", date: "" },
  ],
};

const generateWarehouseData = (): StockPerformanceRow[] => {
  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Books", "Automotive", "Health", "Beauty", "Food"];

  return Array(20).fill(0).map((_, index) => {
    const ctn1 = Math.floor(Math.random() * 50);
    const ctn2 = Math.floor(Math.random() * 50);
    const ctn3 = Math.floor(Math.random() * 50);
    const ctn4 = Math.floor(Math.random() * 50);
    const ctn5 = Math.floor(Math.random() * 50);
    const ctn6 = Math.floor(Math.random() * 50);
    const ctn7 = Math.floor(Math.random() * 50);
    const ctn8 = Math.floor(Math.random() * 50);
    const whStock = Math.floor(Math.random() * 500) + 50;
    const fbaStock = Math.floor(Math.random() * 200);
    const totalCtn = ctn1 + ctn2 + ctn3 + ctn4 + ctn5 + ctn6 + ctn7 + ctn8;
    const allStock = whStock + totalCtn + fbaStock;
    const daysCover = Math.floor(Math.random() * 90) + 10;

    return {
      id: index + 1,
      itemNumber: `ITM-${String(10000 + index).padStart(6, "0")}`,
      oldSku: `SKU-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
      itemTitle: `Product ${index + 1} - ${categories[Math.floor(Math.random() * categories.length)]} Premium Item`,
      categoryName: categories[Math.floor(Math.random() * categories.length)],
      whStock,
      linnLast60DaysSale: Math.floor(Math.random() * 300) + 20,
      linnWorksSales: Math.floor(Math.random() * 500) + 50,
      fbaLast30Days: Math.floor(Math.random() * 150),
      fbaLast7Days: Math.floor(Math.random() * 40),
      fbaStock,
      ctn1,
      ctn2,
      ctn3,
      ctn4,
      ctn5,
      ctn6,
      ctn7,
      ctn8,
      allStock,
      maxDc: Math.floor(Math.random() * 100) + 20,
      totalCtn,
      daysCover,
      daysCoverCurrentStock: Math.floor(daysCover * 0.7),
      dispatchDateCover: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2026`,
      remWarehouse: Math.floor(Math.random() * 200) + 10,
      oosDays: Math.floor(Math.random() * 30),
    };
  });
};

export const warehouseData: Record<Warehouse, StockPerformanceRow[]> = {
  UK: generateWarehouseData(),
  DE: generateWarehouseData(),
  US: generateWarehouseData(),
  CA: generateWarehouseData(),
};

export const PAGINATION_MODEL = { page: 0, pageSize: 500 };
