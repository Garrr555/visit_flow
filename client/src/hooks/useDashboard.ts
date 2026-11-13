import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../services/api";
import type { Activity, ActivityStatus, DashboardFiltersState } from "../types";

const initialFilters = (params: URLSearchParams): DashboardFiltersState => ({
  search: params.get("search") || "",
  segment: params.get("segment") || "",
  status: (params.get("status") || "") as ActivityStatus | "",
  startDate: params.get("startDate") || "",
  endDate: params.get("endDate") || "",
});

export function useDashboardActivities() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const [filters, setFilters] = useState<DashboardFiltersState>(() =>
    initialFilters(searchParams),
  );

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // Mengambil seluruh data kunjungan
  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/activities");

      const result: Activity[] = data.data ?? [];

      setActivities(result);
      setFilteredActivities(result);
    } catch {
      setError(
        "Data kunjungan gagal dimuat. Silakan login kembali atau coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  // Mengubah filter
  const setFilter = useCallback(
    <K extends keyof DashboardFiltersState>(
      key: K,
      value: DashboardFiltersState[K],
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  // Reset seluruh filter
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      segment: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  }, []);

  // Menjalankan seluruh filter
  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      const keyword = filters.search.trim();

      // Sinkronisasi filter dengan URL
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);

          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              params.set(key, value);
            } else {
              params.delete(key);
            }
          });

          return params;
        },
        { replace: true },
      );

      // Validasi tanggal
      if (
        filters.startDate &&
        filters.endDate &&
        filters.startDate > filters.endDate
      ) {
        setFilteredActivities([]);
        setError("Tanggal mulai tidak boleh melebihi tanggal akhir.");
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      setError("");

      try {
        let result = activities;

        // Filter entitas dan segment melalui API
        if (keyword || filters.segment) {
          const { data } = await api.get("/entity", {
            params: {
              ...(filters.segment && {
                segment: filters.segment,
              }),
              ...(keyword && {
                search: keyword,
              }),
            },
          });

          const entityIds = new Set(
            (data.data ?? []).map((entity: { id: string }) => entity.id),
          );

          result = result.filter((activity) =>
            entityIds.has(activity.entity.id),
          );
        }

        // Filter status kunjungan
        if (filters.status) {
          result = result.filter(
            (activity) => activity.status === filters.status,
          );
        }

        // Filter tanggal mulai
        if (filters.startDate) {
          result = result.filter(
            (activity) =>
              toDateInputValue(activity.visitDate) >= filters.startDate,
          );
        }

        // Filter tanggal akhir
        if (filters.endDate) {
          result = result.filter(
            (activity) =>
              toDateInputValue(activity.visitDate) <= filters.endDate,
          );
        }

        setFilteredActivities(result);
      } catch {
        setError("Filter data kunjungan gagal. Silakan coba lagi.");
        setFilteredActivities([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [filters, activities, setSearchParams]);

  // Mengubah status kunjungan
  const updateStatus = useCallback(
    async (id: string, status: ActivityStatus) => {
      try {
        await api.patch(`/activities/${id}`, { status });

        await loadActivities();

        toast.success("Berhasil Update Data");
      } catch {
        setError("Status kunjungan gagal diperbarui.");
        toast.error("Gagal Update Data");
      }
    },
    [loadActivities],
  );

  return {
    activities,
    filteredActivities,
    filters,
    setFilter,
    resetFilters,
    loading,
    searchLoading,
    error,
    updateStatus,
    reloadActivities: loadActivities,
  };
}

// Mengubah tanggal menjadi format YYYY-MM-DD
function toDateInputValue(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
