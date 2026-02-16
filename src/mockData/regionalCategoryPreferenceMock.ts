export interface RegionalCategoryData {
  region: string;
  category: string;
  value: number;
}

export const regionalCategoryData: RegionalCategoryData[] = [
  // DE (Germany) - Mostly Bundles
  { region: 'DE', category: 'BUNDLES', value: 850 },
  { region: 'DE', category: 'ELECTRONICS', value: 120 },
  { region: 'DE', category: 'FASHION', value: 80 },
  
  // CA (Canada) - Handling Abandoned Items
  { region: 'CA', category: 'ABANDONED ITEMS', value: 920 },
  { region: 'CA', category: 'BUNDLES', value: 150 },
  { region: 'CA', category: 'HOME & GARDEN', value: 300 },
  
  // UK (United Kingdom) - Handling Abandoned Items
  { region: 'UK', category: 'ABANDONED ITEMS', value: 780 },
  { region: 'UK', category: 'ELECTRONICS', value: 200 },
  { region: 'UK', category: 'BOOKS', value: 450 },
  
  // US (United States) - Handling Abandoned Items
  { region: 'US', category: 'ABANDONED ITEMS', value: 1200 },
  { region: 'US', category: 'FASHION', value: 600 },
  { region: 'US', category: 'TOYS', value: 400 },
  
  // Other regions for variety
  { region: 'FR', category: 'ELECTRONICS', value: 500 },
  { region: 'FR', category: 'FASHION', value: 700 },
  { region: 'FR', category: 'BEAUTY', value: 300 },
  
  { region: 'AU', category: 'SPORTS', value: 650 },
  { region: 'AU', category: 'HOME & GARDEN', value: 400 },
  { region: 'AU', category: 'BUNDLES', value: 200 },
  
  { region: 'JP', category: 'ELECTRONICS', value: 900 },
  { region: 'JP', category: 'TOYS', value: 550 },
  { region: 'JP', category: 'AUTOMOTIVE', value: 300 },
];
