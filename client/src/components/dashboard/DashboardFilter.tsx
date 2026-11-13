import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import type { DashboardFiltersState } from "../../types";

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  onFilterChange: <K extends keyof DashboardFiltersState>(
    key: K,
    value: DashboardFiltersState[K],
  ) => void;
  onReset: () => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export function DashboardFilters({
  filters,
  onFilterChange,
  onReset,
}: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.segment,
    filters.status,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };

  return (
    <div className="relative mb-5 flex flex-col gap-3 sm:flex-row">
      {/* Search Entitas */}
      <div className="relative flex-1">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Cari nama entitas..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
          isOpen || activeFilterCount > 0
            ? "border-orange-200 bg-orange-50 text-orange-600"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal size={17} />
        Filter
        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown
          size={15}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Popup */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/10 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-[380px]">
            {/* Popup Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-bold text-slate-800">Filter Data</h3>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="space-y-5 p-5 grid grid-cols-2 gap-3">
              {/* Segment */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Segment Entitas
                </label>

                <select
                  value={filters.segment}
                  onChange={(e) => onFilterChange("segment", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Semua Segment</option>
                  <option value="B2G">B2G</option>
                  <option value="B2B">B2B</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Status Kunjungan
                </label>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    onFilterChange(
                      "status",
                      e.target.value as DashboardFiltersState["status"],
                    )
                  }
                  className={inputClass}
                >
                  <option value="">Semua Status</option>
                  <option value="VISITED">Sudah Dikunjungi</option>
                  <option value="NOT_VISITED">Belum Dikunjungi</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Tanggal Mulai
                </label>

                <input
                  type="date"
                  value={filters.startDate}
                  max={filters.endDate || undefined}
                  onChange={(e) => onFilterChange("startDate", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Tanggal Akhir
                </label>

                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate || undefined}
                  onChange={(e) => onFilterChange("endDate", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Popup Footer */}
            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 transition bg-red-400 hover:bg-red-200/70 hover:text-slate-500"
              >
                <RotateCcw size={14} />
                Reset Filter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
