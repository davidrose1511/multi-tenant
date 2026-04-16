"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SIZE_MEASUREMENTS } from "@/lib/constants/size-measurements";

interface SizeChartDialogProps {
  sizes: string[];
}

export function SizeChartDialog({ sizes }: SizeChartDialogProps) {
  // show all standard sizes in chart, highlight ones available for this item
  const chartSizes = Object.keys(SIZE_MEASUREMENTS);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm underline underline-offset-4 text-foreground hover:opacity-60 transition-opacity">
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="heading-editorial text-2xl">
            Size Guide
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-foreground mb-4">
          All measurements are in inches and refer to body measurements, not
          garment measurements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-xs font-semibold tracking-widest uppercase text-foreground">
                  Size
                </th>
                <th className="text-left py-2 pr-4 text-xs font-semibold tracking-widest uppercase text-foreground">
                  Bust
                </th>
                <th className="text-left py-2 pr-4 text-xs font-semibold tracking-widest uppercase text-foreground">
                  Waist
                </th>
                <th className="text-left py-2 text-xs font-semibold tracking-widest uppercase text-foreground">
                  Hips
                </th>
              </tr>
            </thead>
            <tbody>
              {chartSizes.map((size) => {
                const m = SIZE_MEASUREMENTS[size];
                const available = sizes.includes(size);
                return (
                  <tr
                    key={size}
                    className={`border-b border-border last:border-0 ${
                      available ? "text-foreground" : "text-foreground/40"
                    }`}
                  >
                    <td className="py-2.5 pr-4 font-medium">{size}</td>
                    <td className="py-2.5 pr-4">{m.bust}</td>
                    <td className="py-2.5 pr-4">{m.waist}</td>
                    <td className="py-2.5">{m.hips}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-foreground/60 mt-2">
          Greyed out sizes are not available for this item.
        </p>
      </DialogContent>
    </Dialog>
  );
}
