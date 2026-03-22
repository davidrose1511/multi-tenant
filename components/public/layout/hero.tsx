type Business = {
  name: string;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  address: string | null;
  theme_color: string | null;
};

export function Hero({ business }: { business: Business }) {
  return (
    <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-muted">
      {/* Cover image */}
      {business.cover_image_url ? (
        <img
          src={business.cover_image_url}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ backgroundColor: business.theme_color ?? "#e63946" }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-2">
        <h1 className="text-3xl font-bold text-white">{business.name}</h1>
        {business.description && (
          <p className="text-sm text-white/80 max-w-sm">
            {business.description}
          </p>
        )}
        {business.address && (
          <p className="text-xs text-white/60">{business.address}</p>
        )}
      </div>
    </div>
  );
}
