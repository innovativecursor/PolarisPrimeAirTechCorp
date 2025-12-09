"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  columnWidths?: string;
};

export default function PolarisTable<T>({
  columns,
  data,
  getCell,
  columnWidths,
}: PolarisTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f4f5f8] hover:bg-[#f4f5f8] border-b-slate-200">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase px-6 py-3 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="bg-white hover:bg-slate-50 border-b-slate-200"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={`px-6 py-4 text-sm ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {getCell(row, col.key, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
