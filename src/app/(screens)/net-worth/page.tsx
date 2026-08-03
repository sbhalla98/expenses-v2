"use client";

import NetWorthAssetForm from "@/components/common/net-worth-asset-form";
import NetWorthSnapshotForm from "@/components/common/net-worth-snapshot-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useDeleteNetWorthAsset,
  useDeleteNetWorthSnapshot,
  useNetWorthAssets,
  useNetWorthSnapshots,
} from "@/hooks/use-net-worth";
import { format } from "date-fns";
import {
  CalendarDays,
  Coins,
  History,
  Info,
  Loader2,
  Plus,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import useConfigStore from "@/store/use-config-store";
import { PERSONS } from "@/lib/constants";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function NetWorthPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "grid" | "assets">(
    "dashboard",
  );
  const [ownerFilter, setOwnerFilter] = useState<"All" | "PERSON1" | "PERSON2" | "Both">("All");

  const config = useConfigStore();
  const person1Name = config[PERSONS.PERSON1] || "Person 1";
  const person2Name = config[PERSONS.PERSON2] || "Person 2";

  // Drawer management
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [isSnapshotDrawerOpen, setIsSnapshotDrawerOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editingSnapshot, setEditingSnapshot] = useState<any>(null);

  // APIs
  const { data: assets = [], isLoading: assetsLoading } = useNetWorthAssets();
  const { data: snapshots = [], isLoading: snapshotsLoading } =
    useNetWorthSnapshots();
  const deleteAssetMutation = useDeleteNetWorthAsset();
  const deleteSnapshotMutation = useDeleteNetWorthSnapshot();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddNewAsset = () => {
    setEditingAsset(null);
    setIsAssetDrawerOpen(true);
  };

  const handleEditAsset = (asset: any) => {
    setEditingAsset({
      ...asset,
      startDate: asset.startDate ? new Date(asset.startDate) : undefined,
      maturityDate: asset.maturityDate ? new Date(asset.maturityDate) : undefined,
    });
    setIsAssetDrawerOpen(true);
  };

  const handleAddNewSnapshot = () => {
    setEditingSnapshot(null);
    setIsSnapshotDrawerOpen(true);
  };

  const handleEditSnapshot = (snapshot: any) => {
    setEditingSnapshot(snapshot);
    setIsSnapshotDrawerOpen(true);
  };

  if (!mounted || assetsLoading || snapshotsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate Net Worth for each snapshot
  // We sort snapshots chronologically (date ascending) for the chart
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const filteredAssets = assets.filter((asset: any) => {
    if (ownerFilter === "All") return true;
    const assetOwner = asset.owner || "Both";
    return assetOwner === ownerFilter;
  });

  const chartData = sortedSnapshots.map((snap) => {
    let total = 0;
    const breakdown: { [cat: string]: number } = {};

    filteredAssets.forEach((asset) => {
      const val = snap.values[asset.id] || 0;
      total += val;
      breakdown[asset.category] = (breakdown[asset.category] || 0) + val;
    });

    return {
      date: snap.date,
      formattedDate: format(new Date(snap.date), "MMM yy"),
      "Net Worth": total,
      ...breakdown,
      rawSnapshot: snap,
    };
  });

  const latestSnapshot = chartData[chartData.length - 1];
  const previousSnapshot = chartData[chartData.length - 2];

  const currentNetWorth = latestSnapshot ? latestSnapshot["Net Worth"] : 0;
  const previousNetWorth = previousSnapshot ? previousSnapshot["Net Worth"] : 0;

  const changeAmount = currentNetWorth - previousNetWorth;
  const isUp = changeAmount >= 0;
  const changePercentage =
    previousNetWorth > 0 ? (changeAmount / previousNetWorth) * 100 : 0;

  // Custom tooltips for Recharts
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black text-white p-3 rounded-lg border border-gray-800 shadow-xl text-xs space-y-1">
          <p className="font-bold border-b border-gray-700 pb-1 mb-1">
            {format(new Date(data.date), "dd MMMM yyyy")}
          </p>
          <p className="text-emerald-400 font-semibold text-sm">
            Net Worth: ₹{data["Net Worth"]?.toLocaleString("en-IN")}
          </p>
          <div className="pt-1 text-gray-400 space-y-0.5">
            {Object.keys(data)
              .filter(
                (k) =>
                  ![
                    "date",
                    "formattedDate",
                    "Net Worth",
                    "rawSnapshot",
                  ].includes(k),
              )
              .map((cat) => (
                <p key={cat} className="capitalize">
                  {cat.replace("_", " ")}: ₹
                  {data[cat]?.toLocaleString("en-IN")}
                </p>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col flex-1 h-0 p-2 pb-24 overflow-y-auto w-full max-w-[400px]">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Total Net Worth
          </p>
          <h2 className="text-3xl font-black text-black select-none">
            ₹{currentNetWorth.toLocaleString("en-IN")}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 h-4 shrink-0">
            {latestSnapshot && previousSnapshot ? (
              <>
                {isUp ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                )}
                <span
                  className={`text-xs font-bold ${
                    isUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isUp ? "+" : ""}
                  ₹{Math.abs(changeAmount).toLocaleString("en-IN")} ({isUp ? "+" : ""}
                  {changePercentage.toFixed(1)}%)
                </span>
                <span className="text-xxs text-muted-foreground select-none">
                  vs {format(new Date(previousSnapshot.date), "dd MMM yy")}
                </span>
              </>
            ) : (
              <span className="text-xxs text-muted-foreground select-none">No previous records</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={handleAddNewAsset} title="Manage Assets">
            <Settings className="h-4 w-4 text-gray-700" />
          </Button>
          <Button size="sm" onClick={handleAddNewSnapshot}>
            <Plus className="mr-1.5 h-4 w-4" /> Log Value
          </Button>
        </div>
      </div>

      {/* Owner Filters */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4 gap-1 text-[10px] font-bold text-gray-500 shrink-0">
        <button
          onClick={() => setOwnerFilter("All")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            ownerFilter === "All"
              ? "bg-black text-white shadow-sm"
              : "hover:text-black"
          }`}
        >
          Combined
        </button>
        <button
          onClick={() => setOwnerFilter("PERSON1")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            ownerFilter === "PERSON1"
              ? "bg-black text-white shadow-sm"
              : "hover:text-black"
          }`}
        >
          {person1Name}
        </button>
        <button
          onClick={() => setOwnerFilter("PERSON2")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            ownerFilter === "PERSON2"
              ? "bg-black text-white shadow-sm"
              : "hover:text-black"
          }`}
        >
          {person2Name}
        </button>
        <button
          onClick={() => setOwnerFilter("Both")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            ownerFilter === "Both"
              ? "bg-black text-white shadow-sm"
              : "hover:text-black"
          }`}
        >
          Joint
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "dashboard"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "grid"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Spreadsheet
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "assets"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Assets ({filteredAssets.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Chart Card */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-gray-800">
                <Coins className="h-4 w-4 text-yellow-600" /> Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 h-52">
              {chartData.length === 0 ? (
                <div className="flex h-full flex-col justify-center items-center text-center text-muted-foreground text-xs p-4">
                  <Info className="h-6 w-6 mb-2" />
                  No snapshots recorded yet. Log your first values using the &quot;Log Value&quot; button.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="formattedDate"
                      tickLine={false}
                      axisLine={false}
                      className="text-xxs font-medium"
                      dy={5}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xxs font-medium"
                      tickFormatter={(val) => `₹${val / 100000}L`}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Net Worth"
                      stroke="#000000"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#netWorthGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Allocation */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800">
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              {filteredAssets.length === 0 || !latestSnapshot ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Add assets and record values to view breakdown.
                </p>
              ) : (
                Object.keys(latestSnapshot)
                  .filter(
                    (k) =>
                      ![
                        "date",
                        "formattedDate",
                        "Net Worth",
                        "rawSnapshot",
                      ].includes(k),
                  )
                  .map((catKey) => {
                    const catVal = (latestSnapshot as any)[catKey] || 0;
                    const percent =
                      currentNetWorth > 0 ? (catVal / currentNetWorth) * 100 : 0;
                    if (catVal <= 0) return null;

                    return (
                      <div key={catKey} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="capitalize text-gray-700">
                            {catKey.replace("_", " ")}
                          </span>
                          <span className="text-gray-900">
                            ₹{catVal.toLocaleString("en-IN")}{" "}
                            <span className="text-muted-foreground text-xxs font-medium ml-1">
                              ({percent.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-black rounded-full h-1.5 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "grid" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <History className="h-4 w-4" /> Historical Grid
            </h3>
            <span className="text-xxs text-gray-400">Scroll table horizontally →</span>
          </div>

          {filteredAssets.length === 0 || snapshots.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground p-4 text-xs">
              Create assets and log at least one snapshot to populate the historical grid.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-150 bg-gray-50 text-gray-500 font-bold select-none h-10">
                    <th className="px-3 py-1 font-semibold sticky left-0 bg-gray-50 z-2">Item</th>
                    <th className="px-2 py-1 font-semibold">Class</th>
                    {sortedSnapshots.map((snap) => (
                      <th
                        key={snap.id}
                        onClick={() => handleEditSnapshot(snap)}
                        className="px-3 py-1 font-bold text-center cursor-pointer hover:bg-gray-100 transition-colors relative group h-10"
                      >
                        <div className="flex flex-col items-center">
                          <span>{format(new Date(snap.date), "dd MMM yy")}</span>
                          <span className="text-xxs font-medium text-gray-400 hover:text-black mt-0.5">
                            Edit
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50 h-10">
                      <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-white shadow-sm max-w-[120px] truncate">
                        {asset.name}
                      </td>
                      <td className="px-2 py-2 text-xxs capitalize text-muted-foreground">
                        {asset.category.replace("_", " ")}
                      </td>
                      {sortedSnapshots.map((snap) => {
                        const val = snap.values[asset.id] || 0;
                        return (
                          <td key={snap.id} className="px-3 py-2 text-right font-medium numeric">
                            ₹{val.toLocaleString("en-IN")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold h-11 border-t-2 border-gray-200 sticky bottom-0">
                    <td className="px-3 py-2 text-gray-900 sticky left-0 bg-gray-50">Total Assets:</td>
                    <td className="px-2 py-2"></td>
                    {sortedSnapshots.map((snap) => {
                      const total = filteredAssets.reduce(
                        (sum, asset) => sum + (snap.values[asset.id] || 0),
                        0,
                      );
                      return (
                        <td key={snap.id} className="px-3 py-2 text-right text-gray-950 font-black">
                          ₹{total.toLocaleString("en-IN")}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "assets" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Asset Configuration
            </h3>
            <Button size="sm" variant="outline" onClick={handleAddNewAsset}>
              <Plus className="h-3.5 w-3.5 mr-1" /> New Asset
            </Button>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground p-4 text-xs">
              No assets configured. Add your first asset (e.g. Stocks, FD, Gold) using the &quot;New Asset&quot; button.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-start justify-between p-3 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex flex-wrap items-center gap-1.5 matches-owner">
                      <span className="font-semibold text-sm text-gray-900 truncate">
                        {asset.name}
                      </span>
                      <Badge className="text-[9px] py-0 px-1.5 capitalize bg-gray-100 text-gray-600 border-none">
                        {asset.category.replace("_", " ")}
                      </Badge>
                      <Badge className="text-[9px] py-0 px-1.5 bg-blue-50 text-blue-600 border-none font-bold">
                        {asset.owner === "PERSON1"
                          ? person1Name
                          : asset.owner === "PERSON2"
                          ? person2Name
                          : "Joint"}
                      </Badge>
                    </div>
                    {asset.trackingType === "quantity" && asset.quantity && (
                      <p className="text-xxs text-muted-foreground mt-0.5 font-medium">
                        Quantity: {asset.quantity} {asset.unitLabel || "units"}
                      </p>
                    )}
                    {asset.trackingType === "fd" && asset.principal && (
                      <p className="text-xxs text-muted-foreground mt-0.5 font-medium">
                        Principal: ₹{asset.principal.toLocaleString("en-IN")} |{" "}
                        {asset.interestRate}% Interest
                      </p>
                    )}
                    {asset.notes && (
                      <p className="text-xxxs text-gray-500 italic mt-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100/70 flex items-start gap-1">
                        <Info className="h-2.5 w-2.5 mt-0.5 text-gray-400 shrink-0" />
                        <span>{asset.notes}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditAsset(asset)}
                      className="text-gray-500 hover:text-black h-8 text-xxs px-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
                          deleteAssetMutation.mutate(asset.id);
                        }
                      }}
                      className="text-gray-400 hover:text-rose-600 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Asset Drawer */}
      <Drawer open={isAssetDrawerOpen} onOpenChange={setIsAssetDrawerOpen}>
        <DrawerContent>
          <div className="overflow-y-auto max-h-[85vh] pb-8 pr-1">
            <DrawerHeader>
              <DrawerTitle className="text-center font-bold">
                {editingAsset ? "Edit Asset" : "Configure New Asset"}
              </DrawerTitle>
            </DrawerHeader>
            <NetWorthAssetForm
              key={editingAsset?.id || "new-asset"}
              id={editingAsset?.id}
              initialValues={editingAsset || undefined}
              onSuccess={() => setIsAssetDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Snapshot / Values Log Drawer */}
      <Drawer open={isSnapshotDrawerOpen} onOpenChange={setIsSnapshotDrawerOpen}>
        <DrawerContent>
          <div className="overflow-y-auto max-h-[85vh] pb-6 pr-1">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-center font-bold">
                {editingSnapshot ? "Log / Edit Snapshot Values" : "Log Net Worth Values"}
              </DrawerTitle>
              {editingSnapshot && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this snapshot?")) {
                      deleteSnapshotMutation.mutate(editingSnapshot.id, {
                        onSuccess: () => {
                          setIsSnapshotDrawerOpen(false);
                        },
                      });
                    }
                  }}
                  className="absolute right-4 top-4 text-xs font-bold flex items-center text-rose-500 hover:text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </button>
              )}
            </DrawerHeader>
            <NetWorthSnapshotForm
              assets={assets}
              snapshots={snapshots}
              editingSnapshot={editingSnapshot}
              onSuccess={() => setIsSnapshotDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
