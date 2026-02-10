import { Warehouse, ProductionReportRow } from './types';

// Generate random container numbers
const generateContainerNumber = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number}`;
};

// Container numbers for each warehouse
export const warehouseContainers: Record<Warehouse, string[]> = {
  UK: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  DE: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  US: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  CA: [generateContainerNumber(), generateContainerNumber()],
};

// Generate sample data for each warehouse
const generateWarehouseData = (): ProductionReportRow[] => {
  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Books", "Automotive", "Health"];
  const statuses: Array<"Active" | "Inactive" | "Pending"> = ["Active", "Inactive", "Pending"];

  return Array(15).fill(0).map((_, index) => ({
    id: index + 1,
    itemRangeStatus: statuses[Math.floor(Math.random() * statuses.length)],
    categoryName: categories[Math.floor(Math.random() * categories.length)],
    itemNumber: `ITM-${String(1000 + index).padStart(5, "0")}`,
    itemTitle: `Product Item ${index + 1} - ${categories[Math.floor(Math.random() * categories.length)]} Item`,
    warehouseRemYear: Math.floor(Math.random() * 500) + 50,
    jan: Math.floor(Math.random() * 200),
    feb: Math.floor(Math.random() * 200),
    mar: Math.floor(Math.random() * 200),
    apr: Math.floor(Math.random() * 200),
    may: Math.floor(Math.random() * 200),
    jun: Math.floor(Math.random() * 200),
    jul: Math.floor(Math.random() * 200),
    aug: Math.floor(Math.random() * 200),
    sep: Math.floor(Math.random() * 200),
    oct: Math.floor(Math.random() * 200),
    nov: Math.floor(Math.random() * 200),
    dec: Math.floor(Math.random() * 200),
    // January containers and dispatch
    janContainer1: Math.floor(Math.random() * 100),
    janContainer2: Math.floor(Math.random() * 100),
    janContainer3: Math.floor(Math.random() * 100),
    janContainer4: Math.floor(Math.random() * 100),
    janContainer5: Math.floor(Math.random() * 100),
    janTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // February containers and dispatch
    febContainer1: Math.floor(Math.random() * 100),
    febContainer2: Math.floor(Math.random() * 100),
    febContainer3: Math.floor(Math.random() * 100),
    febContainer4: Math.floor(Math.random() * 100),
    febContainer5: Math.floor(Math.random() * 100),
    febTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // March containers and dispatch
    marContainer1: Math.floor(Math.random() * 100),
    marContainer2: Math.floor(Math.random() * 100),
    marContainer3: Math.floor(Math.random() * 100),
    marContainer4: Math.floor(Math.random() * 100),
    marContainer5: Math.floor(Math.random() * 100),
    marTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // April containers and dispatch
    aprContainer1: Math.floor(Math.random() * 100),
    aprContainer2: Math.floor(Math.random() * 100),
    aprContainer3: Math.floor(Math.random() * 100),
    aprContainer4: Math.floor(Math.random() * 100),
    aprContainer5: Math.floor(Math.random() * 100),
    aprTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // May containers and dispatch
    mayContainer1: Math.floor(Math.random() * 100),
    mayContainer2: Math.floor(Math.random() * 100),
    mayContainer3: Math.floor(Math.random() * 100),
    mayContainer4: Math.floor(Math.random() * 100),
    mayContainer5: Math.floor(Math.random() * 100),
    mayTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // June containers and dispatch
    junContainer1: Math.floor(Math.random() * 100),
    junContainer2: Math.floor(Math.random() * 100),
    junContainer3: Math.floor(Math.random() * 100),
    junContainer4: Math.floor(Math.random() * 100),
    junContainer5: Math.floor(Math.random() * 100),
    junTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // July containers and dispatch
    julContainer1: Math.floor(Math.random() * 100),
    julContainer2: Math.floor(Math.random() * 100),
    julContainer3: Math.floor(Math.random() * 100),
    julContainer4: Math.floor(Math.random() * 100),
    julContainer5: Math.floor(Math.random() * 100),
    julTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // August containers and dispatch
    augContainer1: Math.floor(Math.random() * 100),
    augContainer2: Math.floor(Math.random() * 100),
    augContainer3: Math.floor(Math.random() * 100),
    augContainer4: Math.floor(Math.random() * 100),
    augContainer5: Math.floor(Math.random() * 100),
    augTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // September containers and dispatch
    sepContainer1: Math.floor(Math.random() * 100),
    sepContainer2: Math.floor(Math.random() * 100),
    sepContainer3: Math.floor(Math.random() * 100),
    sepContainer4: Math.floor(Math.random() * 100),
    sepContainer5: Math.floor(Math.random() * 100),
    sepTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // October containers and dispatch
    octContainer1: Math.floor(Math.random() * 100),
    octContainer2: Math.floor(Math.random() * 100),
    octContainer3: Math.floor(Math.random() * 100),
    octContainer4: Math.floor(Math.random() * 100),
    octContainer5: Math.floor(Math.random() * 100),
    octTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // November containers and dispatch
    novContainer1: Math.floor(Math.random() * 100),
    novContainer2: Math.floor(Math.random() * 100),
    novContainer3: Math.floor(Math.random() * 100),
    novContainer4: Math.floor(Math.random() * 100),
    novContainer5: Math.floor(Math.random() * 100),
    novTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // December containers and dispatch
    decContainer1: Math.floor(Math.random() * 100),
    decContainer2: Math.floor(Math.random() * 100),
    decContainer3: Math.floor(Math.random() * 100),
    decContainer4: Math.floor(Math.random() * 100),
    decContainer5: Math.floor(Math.random() * 100),
    decTotalDispatch: Math.floor(Math.random() * 500) + 50,
    remWarehouse: Math.floor(Math.random() * 300) + 20,
  }));
};

// Data for each warehouse
export const warehouseData: Record<Warehouse, ProductionReportRow[]> = {
  UK: generateWarehouseData(),
  DE: generateWarehouseData(),
  US: generateWarehouseData(),
  CA: generateWarehouseData(),
};
