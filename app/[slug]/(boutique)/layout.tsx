import "./boutique.css";

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background boutique-site">
      {children}
    </main>
  );
}
