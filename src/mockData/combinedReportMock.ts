import { CombinedReportRow, ContainerInfo } from '../types/combinedReport';

// Categories for products
const categories = [
  'Electronics',
  'Home & Garden',
  'Clothing & Accessories',
  'Sports & Outdoors',
  'Health & Beauty',
  'Toys & Games',
  'Books & Media',
  'Automotive'
];

// Data sources
const dataSources = ['Linnworks', 'Manual Upload', 'API Import', 'CSV Import'];

// Container prefixes by region
const containerPrefixes = {
  CA: 'C-',
  DE: 'DE-',
  UK: 'S-',
  US: 'U-'
};

// Helper function to generate random date
const getRandomDate = (daysAgo: number, daysAhead: number): string => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * (daysAhead + daysAgo)) - daysAgo;
  const date = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

// Helper function to calculate days between dates
const getDaysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

// Generate container data for a region
const generateContainers = (prefix: string, count: number): ContainerInfo[] => {
  const containers: ContainerInfo[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const containerNumber = `${prefix}${700 + i}`;
    const shipmentDate = getRandomDate(90, 0); // 0-90 days ago
    const shipDate = new Date(shipmentDate);
    const arrivalDate = new Date(shipDate.getTime() + (40 + Math.floor(Math.random() * 20)) * 24 * 60 * 60 * 1000);
    const arrivalDateStr = arrivalDate.toISOString().split('T')[0];

    const daysUntilArrival = getDaysBetween(now.toISOString().split('T')[0], arrivalDateStr);
    const status: 'Delivered' | number = daysUntilArrival <= 0 ? 'Delivered' : daysUntilArrival;

    containers.push({
      containerNumber,
      shipmentDate,
      arrivalDate: arrivalDateStr,
      status
    });
  }

  return containers;
};

// All containers (shared across all rows)
export const allContainers = {
  CA: generateContainers(containerPrefixes.CA, 3),
  DE: generateContainers(containerPrefixes.DE, 6),
  UK: generateContainers(containerPrefixes.UK, 11),
  US: generateContainers(containerPrefixes.US, 12)
};

const DateFromDate = new Date().toISOString().split('T')[0];
// Generate mock data rows
const generateMockData = (count: number): CombinedReportRow[] => {
  const data: CombinedReportRow[] = [];

  for (let i = 0; i < count; i++) {
    const row: CombinedReportRow = {
      id: i + 1,
      uploadDate: getRandomDate(30, 0),
      dataFrom: DateFromDate,
      categoryName: categories[i % categories.length],
      itemNumber: `ITM-${String(10000 + i).padStart(6, '0')}`,
      itemTitle: `Product ${i + 1} - ${categories[i % categories.length]}`,

      // Last 60 Days Sales by Region
      CA_Last_60_Days_Sale: Math.floor(Math.random() * 500),
      DE_Last_60_Days_Sale: Math.floor(Math.random() * 800),
      UK_Last_60_Days_Sale: Math.floor(Math.random() * 1000),
      US_Last_60_Days_Sale: Math.floor(Math.random() * 1200),

      // Warehouse Data by Region
      CA_WH_Data: Math.floor(Math.random() * 2000),
      DE_WH_Data: Math.floor(Math.random() * 3000),
      UK_WH_Data: Math.floor(Math.random() * 4000),
      US_WH_Data: Math.floor(Math.random() * 5000),

      // Initialize summary quantities
      CA_Containers_Overall_Qty: 0,
      CA_Containers_Intransit_Qty: 0,
      DE_Containers_Overall_Qty: 0,
      DE_Containers_Intransit_Qty: 0,
      UK_Containers_Overall_Qty: 0,
      UK_Containers_Intransit_Qty: 0,
      US_Containers_Overall_Qty: 0,
      US_Containers_Intransit_Qty: 0,
    };

    // Add container columns dynamically for each region
    let caOverallQty = 0, caIntransitQty = 0;
    let deOverallQty = 0, deIntransitQty = 0;
    let ukOverallQty = 0, ukIntransitQty = 0;
    let usOverallQty = 0, usIntransitQty = 0;

    allContainers.CA.forEach(container => {
      const qty = Math.floor(Math.random() * 300);
      const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
      row[columnKey] = qty;
      caOverallQty += qty;
      if (container.status !== 'Delivered') caIntransitQty += qty;
    });

    allContainers.DE.forEach(container => {
      const qty = Math.floor(Math.random() * 300);
      const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
      row[columnKey] = qty;
      deOverallQty += qty;
      if (container.status !== 'Delivered') deIntransitQty += qty;
    });

    allContainers.UK.forEach(container => {
      const qty = Math.floor(Math.random() * 300);
      const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
      row[columnKey] = qty;
      ukOverallQty += qty;
      if (container.status !== 'Delivered') ukIntransitQty += qty;
    });

    allContainers.US.forEach(container => {
      const qty = Math.floor(Math.random() * 300);
      const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
      row[columnKey] = qty;
      usOverallQty += qty;
      if (container.status !== 'Delivered') usIntransitQty += qty;
    });

    // Summary Quantities
    row.CA_Containers_Overall_Qty = caOverallQty;
    row.CA_Containers_Intransit_Qty = caIntransitQty;
    row.DE_Containers_Overall_Qty = deOverallQty;
    row.DE_Containers_Intransit_Qty = deIntransitQty;
    row.UK_Containers_Overall_Qty = ukOverallQty;
    row.UK_Containers_Intransit_Qty = ukIntransitQty;
    row.US_Containers_Overall_Qty = usOverallQty;
    row.US_Containers_Intransit_Qty = usIntransitQty;

    data.push(row as CombinedReportRow);
  }

  return data;
};

// Export mock data
export const combinedReportData: CombinedReportRow[] = generateMockData(150);

// Get unique categories for filtering
export const getUniqueCategories = (): string[] => {
  return categories;
};

// Get unique data sources for filtering
export const getDataSources = (): string[] => {
  return dataSources;
};

