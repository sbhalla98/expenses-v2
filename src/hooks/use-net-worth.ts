import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { NetWorthAsset, NetWorthSnapshot } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch assets
export const useNetWorthAssets = () => {
  const { toast } = useToast();

  return useQuery<NetWorthAsset[]>({
    queryKey: ["net-worth-assets"],
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ROUTES.NET_WORTH_ASSETS);
        return response.data.data;
      } catch (err) {
        toast(TOAST_MESSAGES.GENERIC_ERROR);
        throw err;
      }
    },
  });
};

// Add asset
export const useAddNetWorthAsset = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<NetWorthAsset, "id" | "userId" | "createdAt">) => {
      const response = await apiClient.post(API_ROUTES.NET_WORTH_ASSETS, data);
      return response.data.data;
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-assets"] });
      toast({
        title: "Success",
        description: "Asset created successfully",
      });
      onSuccess?.();
    },
  });
};

// Edit asset
export const useEditNetWorthAsset = (id: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<NetWorthAsset>) => {
      const response = await apiClient.put(API_ROUTES.NET_WORTH_ASSETS, {
        ...data,
        id,
      });
      return response.data.data;
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-assets"] });
      toast({
        title: "Success",
        description: "Asset updated successfully",
      });
      onSuccess?.();
    },
  });
};

// Delete asset
export const useDeleteNetWorthAsset = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ROUTES.NET_WORTH_ASSETS}?id=${id}`);
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-assets"] });
      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
      onSuccess?.();
    },
  });
};

// Fetch snapshots
export const useNetWorthSnapshots = () => {
  const { toast } = useToast();

  return useQuery<NetWorthSnapshot[]>({
    queryKey: ["net-worth-snapshots"],
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ROUTES.NET_WORTH_SNAPSHOTS);
        return response.data.data;
      } catch (err) {
        toast(TOAST_MESSAGES.GENERIC_ERROR);
        throw err;
      }
    },
  });
};

// Save (Upsert) snapshot
export const useSaveNetWorthSnapshot = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      date: string;
      goldPricePerGram?: number;
      values: { [assetId: string]: number };
      unitPrices?: { [assetId: string]: number };
    }) => {
      const response = await apiClient.post(API_ROUTES.NET_WORTH_SNAPSHOTS, data);
      return response.data.data;
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-snapshots"] });
      toast({
        title: "Success",
        description: "Snapshot saved successfully",
      });
      onSuccess?.();
    },
  });
};

// Delete snapshot
export const useDeleteNetWorthSnapshot = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ROUTES.NET_WORTH_SNAPSHOTS}?id=${id}`);
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["net-worth-snapshots"] });
      toast({
        title: "Success",
        description: "Snapshot deleted successfully",
      });
      onSuccess?.();
    },
  });
};
