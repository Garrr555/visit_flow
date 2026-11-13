import { useDashboardActivities } from "../hooks/useDashboard";
import { DashboardFilters } from "../components/dashboard/DashboardFilter";
import { ActivityTable } from "../components/dashboard/DashboardActivityTable";
import { CreateVisitModal } from "../components/dashboard/DashboardModalCreate";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function DashboardPage() {

  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    filteredActivities,
    filters,
    setFilter,
    resetFilters,
    loading,
    searchLoading,
    error,
    updateStatus,
    reloadActivities,
  } = useDashboardActivities();

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Rencana Kunjungan</h1>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              <Plus size={18} />
              Kunjungan
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <DashboardFilters
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
        />

        {/* Data Information */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filteredActivities.length} data kunjungan
          </p>

          {searchLoading && (
            <p className="text-xs text-orange-600">Mencari entitas...</p>
          )}
        </div>

        {/* Activity Table */}
        <ActivityTable
          activities={filteredActivities}
          loading={loading}
          onStatusChange={updateStatus}
          onResetFilters={resetFilters}
        />
      </section>

      {/* Create Visit Modal */}
      {showCreateModal && (
        <CreateVisitModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            reloadActivities();
          }}
        />
      )}
    </main>
  );
}
