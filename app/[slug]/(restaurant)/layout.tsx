import "./restaurant.css";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background restaurant-site">
      {children}
    </main>
  );
}
