import { HTMLAttributes } from "react";

type TableProps<T> = {
  columns: Column<T>[];
  rows: Row<T>[];
};

export type Column<T> = {
  key: keyof T;
  header: string;
  className?: HTMLAttributes<T>["className"];
  render?: (row: T, key: string) => React.ReactNode;
};

type Row<T> = {
  id: number;
  data: T;
};

export function Table<T>({ columns, rows }: TableProps<T>) {
  return (
    <div className="scrollable-parent">
      <table className="table-primary">
        <thead className="bg-greenPrimary text-white">
          <tr>
            {(columns ?? []).map((column) => (
              <th key={column.header} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="highlight-selected">
              {(columns ?? []).map((col) => {
                const content = col.render
                  ? col.render(row.data, row.data[col.key] as string)
                  : null;

                return (
                  // Default to rendering a basic <td> with the row data if custom content not provided
                  content ?? (
                    <td key={row.data[col.key] as string} className={col.className}>
                      {row.data[col.key] as React.ReactNode}
                    </td>
                  )
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
