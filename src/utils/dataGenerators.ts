import { SummaryDashboardRow, STATUS_OPTIONS, REASON_OPTIONS, ITEM_TITLES, CATEGORIES } from "../config/summaryDashboard";

/**
 * Utility functions for data generation
 * Separated to follow Single Responsibility Principle
 */
export const generateSummaryDashboardData = (count: number = 50): SummaryDashboardRow[] => {
  return Array(count).fill(0).map((_, index) => {
    const isHighPriority = index < 5;
    return {
      id: index + 1,
      itemNumber: `MSC-T${String(index + 16).padStart(2, "0")}BG-XL`,
      itemTitle: ITEM_TITLES[index % ITEM_TITLES.length],
      categoryName: CATEGORIES[index % CATEGORIES.length],
      wh: index % 10 === 0 ? String(Math.floor(Math.random() * 100)) : "0",
      fbaWhCoverDay: parseFloat((Math.random() * 50).toFixed(5)),
      remaining: Math.floor(Math.random() * 2000) + 100,
      totalDispatchQty: Math.floor(Math.random() * 200),
      dispatchCoverDay: parseFloat((Math.random() * 25).toFixed(5)),
      maxD: parseFloat((Math.random() * 10).toFixed(5)),
      status: isHighPriority ? STATUS_OPTIONS[0] : STATUS_OPTIONS[Math.floor(Math.random() * 3) + 1],
      reason: REASON_OPTIONS[Math.floor(Math.random() * REASON_OPTIONS.length)],
      factoryComments: "",
    };
  });
};
