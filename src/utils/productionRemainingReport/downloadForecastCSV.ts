import { ProductionRemainingRow } from "../../types/Interfaces/interfaces";
import { Warehouse } from "../../types/productionReport";

const FORECAST_FIXED_KEYS: (keyof ProductionRemainingRow)[] = [
  "category_name",
  "item_number",
  "warehouse_region",
];

export function downloadForecastCSV(data: ProductionRemainingRow[], region: Warehouse | string) {
  if (!data || data.length === 0) return;

  const forecastedKeys = Object.keys(data[0]).filter((k) =>
    k.startsWith("FORECASTED Order"),
  );

  const allKeys = [...FORECAST_FIXED_KEYS, ...forecastedKeys];

  const header = allKeys
    .map((k) => `"${String(k).replace(/_/g, " ")}"`)
    .join(",");

  const rows = data.map((row) =>
    allKeys
      .map((k) => {
        const val = (row as Record<string, unknown>)[k];
        const str = val == null ? "" : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(","),
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `forecast_${region}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

