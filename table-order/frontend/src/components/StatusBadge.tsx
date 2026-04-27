const colors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};
const labels: Record<string, string> = { pending: "대기중", preparing: "준비중", completed: "완료" };

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span data-testid={`status-badge-${status}`} className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-800"}`}>
      {labels[status] ?? status}
    </span>
  );
}
