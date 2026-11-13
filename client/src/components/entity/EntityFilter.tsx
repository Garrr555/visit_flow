import { Plus, Search } from "lucide-react";
import type { User } from "../../types";
import { useEffect, useState } from "react";

interface Filter {
  user: User | null;
  search: string;
  segment: string;
  setShowEntityModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSegment: React.Dispatch<React.SetStateAction<string>>;
}

const EntityFilter = ({
  user,
  search,
  setSearch,
  segment,
  setSegment,
  setShowEntityModal,
}: Filter) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Sinkronisasi ketika URL berubah atau filter di-reset
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search 500ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [localSearch, search, setSearch]);
  return (
    <div className="relative mb-5 flex flex-col gap-3 sm:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Filter Segment */}
      <select
        value={segment}
        onChange={(e) => setSegment(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >
        <option value="">All</option>
        <option value="B2G">B2G</option>
        <option value="B2B">B2B</option>
      </select>

      {/* Add Entity */}
      <button
        type="button"
        onClick={() => setShowEntityModal(true)}
        className={`${user?.role === "ADMIN" ? "" : "hidden"} flex items-center justify-center gap-2 rounded-lg border border-orange-600 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-300 hover:text-white`}
      >
        <Plus size={18} />
        Entitas
      </button>
    </div>
  );
};

export default EntityFilter;
