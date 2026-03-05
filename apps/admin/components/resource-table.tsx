import type { ReactNode } from 'react'

export function ResourceTable({
  title,
  subtitle,
  columns,
  rows,
  actions
}: {
  title: string
  subtitle: string
  columns: string[]
  rows: Array<Array<ReactNode>>
  actions?: ReactNode
}) {
  return (
    <section className="panel grid">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h2 className="heading" style={{ marginBottom: 6 }}>
            {title}
          </h2>
          <p className="subtle">{subtitle}</p>
        </div>
        {actions ? <div className="actions">{actions}</div> : null}
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="subtle">
                No records. Check API or create new entities.
              </td>
            </tr>
          ) : (
            rows.map((cells, rowIndex) => (
              <tr key={rowIndex}>
                {cells.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
