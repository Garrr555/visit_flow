import { useCallback, useEffect, useState } from "react";
import type { Entity, User } from "../types";
import { useDashboardActivities } from "../hooks/useDashboard";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { EntityTable } from "../components/entity/EntityTable";
import { CreateEntityModal } from "../components/dashboard/DashboardModalAdd";
import EntityFilter from "../components/entity/EntityFilter";

export default function EntityPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEntityModal, setShowEntityModal] = useState(false);

  const { reloadActivities } = useDashboardActivities();
  const user: User | null = useAuthStore((state) => state.user);

  const fetchEntities = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/entity", {
        params: {
          ...(search.trim() && { search: search.trim() }),
          ...(segment && { segment }),
        },
      });

      setEntities(data.data ?? []);
    } catch {
      toast.error("Gagal mengambil data entitas.");
      setEntities([]);
    } finally {
      setLoading(false);
    }
  }, [search, segment]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEntities();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchEntities]);

  return (
    <div className="space-y-6">
      <EntityFilter
        search={search}
        setSearch={setSearch}
        segment={segment}
        setSegment={setSegment}
        setShowEntityModal={setShowEntityModal}
        user={user}
      />

      <EntityTable
        entities={entities}
        loading={loading}
        search={search}
        setSearch={setSearch}
      />

      {showEntityModal && (
        <CreateEntityModal
          onClose={() => setShowEntityModal(false)}
          onSuccess={() => {
            setShowEntityModal(false);
            fetchEntities();
            reloadActivities();
          }}
        />
      )}
    </div>
  );
}
