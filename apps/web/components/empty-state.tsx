export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card">
      <p className="meta" style={{ margin: 0 }}>
        {message}
      </p>
    </div>
  )
}
