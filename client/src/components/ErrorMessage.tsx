export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="error">{message}</span>;
}
