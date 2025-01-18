export function FormField({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && <div>{label}</div>}
      {children}
      <div visible={!!error}>{error}</div>
    </div>
  );
}
