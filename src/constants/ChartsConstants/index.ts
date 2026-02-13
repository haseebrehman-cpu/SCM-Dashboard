export const abandonedData = [
  { name: 'Electronics', value: 120 },
  { name: 'Fashion', value: 85 },
  { name: 'Home & Garden', value: 45 },
  { name: 'Beauty', value: 30 },
  { name: 'Sports', value: 25 },
  { name: 'Toys', value: 40 },
  { name: 'Books', value: 35 },
  { name: 'Automotive', value: 20 },
].sort((a, b) => b.value - a.value);

export const warehouseStockData = [
  { category: 'Electronics', sold: { UK: 80, US: 77, CA: 47, DE: 88, AU: 30 }, available: { UK: 120, US: 100, CA: 50, DE: 150, AU: 60 } },
  { category: 'Fashion', sold: { UK: 60, US: 90, CA: 40, DE: 50, AU: 20 }, available: { UK: 80, US: 120, CA: 60, DE: 70, AU: 40 } },
  { category: 'Home & Garden', sold: { UK: 40, US: 50, CA: 30, DE: 40, AU: 15 }, available: { UK: 50, US: 70, CA: 40, DE: 60, AU: 30 } },
  { category: 'Beauty', sold: { UK: 90, US: 110, CA: 60, DE: 80, AU: 40 }, available: { UK: 100, US: 150, CA: 80, DE: 100, AU: 50 } },
  { category: 'Sports', sold: { UK: 30, US: 40, CA: 20, DE: 30, AU: 10 }, available: { UK: 40, US: 50, CA: 30, DE: 40, AU: 20 } },
  { category: 'Toys', sold: { UK: 50, US: 60, CA: 25, DE: 45, AU: 20 }, available: { UK: 60, US: 80, CA: 40, DE: 50, AU: 25 } },
  { category: 'Books', sold: { UK: 70, US: 80, CA: 35, DE: 60, AU: 25 }, available: { UK: 80, US: 100, CA: 50, DE: 70, AU: 35 } },
  { category: 'Automotive', sold: { UK: 40, US: 50, CA: 20, DE: 35, AU: 15 }, available: { UK: 50, US: 60, CA: 30, DE: 40, AU: 20 } },
];

export const topItemsData = [
  { name: 'Wireless Headphones', value: 320, category: 'Electronics' },
  { name: 'Running Shoes', value: 280, category: 'Fashion' },
  { name: 'Smart Watch', value: 250, category: 'Electronics' },
  { name: 'Coffee Maker', value: 220, category: 'Home & Garden' },
  { name: 'Bluetooth Speaker', value: 190, category: 'Electronics' },
  { name: 'Yoga Mat', value: 180, category: 'Sports' },
  { name: 'Face Cream', value: 160, category: 'Beauty' },
  { name: 'Gaming Mouse', value: 150, category: 'Electronics' },
  { name: 'Backpack', value: 140, category: 'Fashion' },
  { name: 'Desk Lamp', value: 130, category: 'Home & Garden' },
  { name: 'Water Bottle', value: 125, category: 'Sports' },
  { name: 'Sunglasses', value: 120, category: 'Fashion' },
  { name: 'Phone Case', value: 115, category: 'Electronics' },
  { name: 'Lipstick', value: 110, category: 'Beauty' },
  { name: 'Plant Pot', value: 105, category: 'Home & Garden' },
  { name: 'Notebook', value: 100, category: 'Books' },
  { name: 'Charger Cable', value: 95, category: 'Electronics' },
  { name: 'T-Shirt', value: 90, category: 'Fashion' },
  { name: 'Socks', value: 85, category: 'Fashion' },
  { name: 'Pen Set', value: 80, category: 'Books' },
].sort((a, b) => a.value - b.value);
