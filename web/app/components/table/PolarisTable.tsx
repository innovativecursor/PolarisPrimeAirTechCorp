"use client";

import type { ReactNode } from "react";

export type PolarisTableColumnKey = string;

export type PolarisTableColumn = {
  /** Unique key used in getCell */
  key: PolarisTableColumnKey;
  header: string;
  align?: "left" | "right";
};

export type PolarisTableProps<T> = {
  columns: PolarisTableColumn[];
  data: T[];
  /** Render cell content for each row/column */
  getCell: (
    row: T,
    columnKey: PolarisTableColumnKey,
    rowIndex: number
  ) => ReactNode;
  /** CSS grid template, e.g. "1.2fr 2.4fr 2.2fr 1.6fr 1.1fr 1.2fr" */
  columnWidths: string;
};

export default function PolarisTable<T>({
  columns,
  data,
  getCell,
  columnWidths,
}: PolarisTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      {/* Header */}
      <div
        className="grid bg-[#f4f5f8] px-6 py-3 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase"
        style={{ gridTemplateColumns: columnWidths }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            className={col.align === "right" ? "text-right" : "text-left"}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Body */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={[
            "grid items-center px-6 py-4 text-sm bg-white",
            rowIndex === 0 ? "border-t border-slate-200" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ gridTemplateColumns: columnWidths }}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              className={col.align === "right" ? "text-right" : "text-left"}
            >
              {getCell(row, col.key, rowIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
