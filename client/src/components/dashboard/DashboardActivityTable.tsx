import { Pencil, Search, X } from "lucide-react";
import type { Activity, ActivityStatus } from "../../types";
import { useState } from "react";
import { EditStatusModal } from "./DashboardModalAction";

interface ActivityTableProps {
  activities: Activity[];
  loading: boolean;
  onStatusChange: (id: string, status: ActivityStatus) => void;
  onResetFilters: () => void;
}

export function ActivityTable({
  activities,
  loading,
  onStatusChange,
  onResetFilters,
}: ActivityTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  // Loading
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <p className="p-8 text-center text-sm text-slate-500">Memuat data...</p>
      </div>
    );
  }

  // Empty State
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Search size={22} className="text-slate-400" />
        </div>

        <h3 className="font-semibold text-slate-700">
          Tidak ada data kunjungan ditemukan
        </h3>

        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
        >
          Reset Semua Filter
        </button>
      </div>
    );
  }

  // Data Table
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Entitas</th>
              <th className="px-5 py-3 text-center">Segmen</th>
              <th className="px-5 py-3 text-center">Wilayah</th>
              <th className="px-5 py-3 text-center">Tanggal</th>
              <th className="px-5 py-3 text-center">Sales</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {activities.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 text-left">
                  <p className="font-medium">{item.entity.name}</p>

                  <p className="text-xs text-slate-500">{item.entity.type}</p>
                </td>

                <td className="px-5 py-4 text-center">{item.segment}</td>

                <td className="px-5 py-4 text-center">{item.entity.region}</td>

                <td className="px-5 py-4 text-center">
                  {new Date(item.visitDate).toLocaleDateString("id-ID")}
                </td>

                <td className="px-5 py-4 text-center">{item.sales.name}</td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === "VISITED"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedActivity(item)}
                      aria-label="Edit status kunjungan"
                      title="Ubah status"
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedActivity && (
        <EditStatusModal
          entityName={selectedActivity.entity.name}
          currentStatus={selectedActivity.status}
          onClose={() => setSelectedActivity(null)}
          onStatusChange={(status) => {
            onStatusChange(selectedActivity.id, status);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
}
