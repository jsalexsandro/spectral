import type { DataTableProps } from "@/lib/ai/ui/catalog"

export function DataTable({
  title,
  columns,
  rows,
  caption,
}: DataTableProps) {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted/60">
              {columns.map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  scope="col"
                  className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-border/60 px-3 py-2 align-top"
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="text-xs text-muted-foreground">{caption}</p>
      )}
    </div>
  )
}
