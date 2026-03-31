export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full px-4 sm:px-8 lg:px-16 ${className ?? ""}`}>
      {children}
    </div>
  );
}
