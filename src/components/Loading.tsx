export function Loading({ label = "Đang tải..." }: { label?: string }) { return <div className="loading"><span className="spinner" />{label}</div>; }
export function EmptyState({ title, description }: { title: string; description?: string }) { return <div className="empty-state"><h3>{title}</h3>{description && <p>{description}</p>}</div>; }
