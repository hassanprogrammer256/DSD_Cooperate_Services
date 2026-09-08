import type { ReactNode } from "react";

import { Pencil, Trash } from "lucide-react";
import IconButton from "@mui/joy/IconButton";

export type DataTableColumn<T> = {
  header: string;
  cell: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (item: T) => string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyMessage?: string;
};

export function DataTable<T>({ columns, rows, getRowKey, onEdit, onDelete, emptyMessage }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center text-sm text-text-secondary">
        {emptyMessage ?? "Nothing here yet."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-semibold">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-border last:border-0 hover:bg-surface-secondary">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3 text-text-primary">
                  {col.cell(row)}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <IconButton size="sm" variant="plain" color="neutral" aria-label="Edit" onClick={() => onEdit(row)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton size="sm" variant="plain" color="danger" aria-label="Delete" onClick={() => onDelete(row)}>
                    <Trash size={16} />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
