import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveNetWorthSnapshot } from "@/hooks/use-net-worth";
import { NetWorthAsset, NetWorthSnapshot } from "@/lib/types";
import { format } from "date-fns";
import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

// Compound interest calculator for FDs
export const computeFDValue = (
  asset: NetWorthAsset,
  snapshotDateStr: string,
) => {
  const principal = asset.principal || 0;
  const rate = asset.interestRate || 0;
  if (!asset.startDate || !asset.maturityDate || !principal) return principal;

  const snapshotDate = new Date(snapshotDateStr);
  const startDate = new Date(asset.startDate);
  const maturityDate = new Date(asset.maturityDate);

  if (snapshotDate < startDate) return 0;

  const targetDate =
    snapshotDate > maturityDate ? maturityDate : snapshotDate;
  const timeDiff = targetDate.getTime() - startDate.getTime();
  const daysElapsed = Math.max(0, timeDiff / (1000 * 60 * 60 * 24));
  const yearsElapsed = daysElapsed / 365.25;

  // Standard quarterly compounding formula
  const compoundingFrequency = 4;
  const value =
    principal *
    Math.pow(
      1 + rate / 100 / compoundingFrequency,
      compoundingFrequency * yearsElapsed,
    );
  return Math.round(value);
};

interface NetWorthSnapshotFormProps {
  assets: NetWorthAsset[];
  snapshots: NetWorthSnapshot[];
  editingSnapshot?: NetWorthSnapshot | null;
  onSuccess?: () => void;
}

export default function NetWorthSnapshotForm({
  assets,
  snapshots,
  editingSnapshot,
  onSuccess,
}: NetWorthSnapshotFormProps) {
  const saveMutation = useSaveNetWorthSnapshot(onSuccess);

  // States
  const [date, setDate] = useState<string>(
    editingSnapshot?.date || new Date().toISOString().split("T")[0],
  );
  
  const [assetValues, setAssetValues] = useState<{ [assetId: string]: number }>(
    {},
  );
  
  const [unitPrices, setUnitPrices] = useState<{ [assetId: string]: number }>(
    {},
  );

  // Load initial values on open or date change
  useEffect(() => {
    if (editingSnapshot) {
      setDate(editingSnapshot.date);
      setAssetValues(editingSnapshot.values || {});
      setUnitPrices(editingSnapshot.unitPrices || {});
    } else {
      // Find the most recent snapshot prior to the selected date to prefill values
      const recentSnapshot = [...snapshots]
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .find((s) => new Date(s.date).getTime() <= new Date(date).getTime());

      const initialValues: { [assetId: string]: number } = {};
      const initialPrices: { [assetId: string]: number } = {};

      assets.forEach((asset) => {
        if (asset.trackingType === "fd") {
          initialValues[asset.id] = computeFDValue(asset, date);
        } else if (asset.trackingType === "quantity") {
          // Fetch previous unit price if available, else default to some sensible values
          const prevPrice = recentSnapshot?.unitPrices?.[asset.id] || 
            (asset.category === "gold" ? 7200 : 100); // 7200/g for gold, 100 per unit for others like mutual funds
          
          initialPrices[asset.id] = prevPrice;
          initialValues[asset.id] = Math.round((asset.quantity || 0) * prevPrice);
        } else {
          // Direct value tracking
          initialValues[asset.id] = recentSnapshot?.values?.[asset.id] || 0;
        }
      });

      setAssetValues(initialValues);
      setUnitPrices(initialPrices);
    }
  }, [editingSnapshot, date, assets, snapshots]);

  // Handle changing price per unit for a specific asset
  const handleUnitPriceChange = (assetId: string, price: number, qty: number) => {
    setUnitPrices((prev) => ({
      ...prev,
      [assetId]: price,
    }));
    
    // Auto-calculate resulting total amount value
    setAssetValues((prev) => ({
      ...prev,
      [assetId]: Math.round(price * qty),
    }));
  };

  // Re-calculate Fixed Deposits if date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);

    // Update FDs based on this new date
    const updatedValues = { ...assetValues };
    assets.forEach((asset) => {
      if (asset.trackingType === "fd") {
        updatedValues[asset.id] = computeFDValue(asset, newDate);
      }
    });
    setAssetValues(updatedValues);
  };

  const handleValueChange = (assetId: string, val: number) => {
    setAssetValues((prev) => ({
      ...prev,
      [assetId]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      date,
      // For general backward compatibility:
      // if there's a gold asset, pick the first gold unit price as the goldPricePerGram
      goldPricePerGram: Object.entries(unitPrices).find(
        ([aid]) => assets.find(a => a.id === aid)?.category === "gold"
      )?.[1] || 7200,
      values: assetValues,
      unitPrices,
    });
  };

  const groupedAssets = assets.reduce(
    (acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = [];
      }
      acc[asset.category].push(asset);
      return acc;
    },
    {} as { [key: string]: NetWorthAsset[] },
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 overflow-y-auto">
      <div>
        <Label htmlFor="snapshot-date">Snapshot Date</Label>
        <Input
          id="snapshot-date"
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="h-10 mt-1"
        />
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Asset Values
        </h3>

        {assets.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No assets defined. Please define assets first.
          </div>
        ) : (
          Object.entries(groupedAssets).map(([category, catAssets]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase capitalize mt-2">
                {category.replace("_", " ")}
              </h4>
              <div className="space-y-3">
                {catAssets.map((asset) => {
                  const currentValue = assetValues[asset.id] ?? 0;
                  const currentPrice = unitPrices[asset.id] ?? 0;

                  return (
                    <div
                      key={asset.id}
                      className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors space-y-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {asset.name}
                          </p>
                          {asset.trackingType === "quantity" && (
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                              Qty: {asset.quantity} {asset.unitLabel}
                            </p>
                          )}
                          {asset.trackingType === "fd" && asset.principal && (
                            <p className="text-xxs text-muted-foreground mt-0.5">
                              Principal: ₹{asset.principal.toLocaleString("en-IN")} | Mat:{" "}
                              {asset.maturityDate
                                ? format(new Date(asset.maturityDate), "dd MMM yyyy")
                                : ""}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between">
                        {asset.trackingType === "quantity" ? (
                          <div className="flex-1 flex items-center min-w-0">
                            <span className="text-xxs text-muted-foreground font-bold mr-1">Rate:</span>
                            <span className="text-gray-400 mr-0.5 text-xs">₹</span>
                            <Input
                              type="number"
                              value={currentPrice}
                              onChange={(e) =>
                                handleUnitPriceChange(
                                  asset.id,
                                  Number(e.target.value),
                                  asset.quantity || 0,
                                )
                              }
                              className="h-8 w-24 text-xs font-medium"
                              placeholder="Price / Unit"
                            />
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center min-w-0">
                            <span className="text-xxs text-muted-foreground font-bold">Direct Value</span>
                          </div>
                        )}

                        <div className="w-36 flex items-center shrink-0">
                          <span className="text-xxs text-gray-500 font-bold mr-1 shrink-0">Total: ₹</span>
                          <Input
                            type="number"
                            value={currentValue}
                            onChange={(e) =>
                              handleValueChange(asset.id, Number(e.target.value))
                            }
                            className="h-9 font-semibold text-right"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={saveMutation.isPending || assets.length === 0}
      >
        {saveMutation.isPending ? "Saving..." : "Save Snapshot"}
        <CheckCheck className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
