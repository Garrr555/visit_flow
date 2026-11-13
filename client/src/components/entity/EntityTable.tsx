import { Building2, Search } from "lucide-react";
import type { Entity } from "../../types";

interface EntityTableInterface {
  loading: boolean;
  entities: Entity[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export function EntityTable({
  loading,
  entities,
  search,
  setSearch,
}: EntityTableInterface) {
  return (
    <div className="space-y-4">
      {/* Loading */}
      {loading ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <p className="p-8 text-center text-sm text-slate-500">
            Memuat data entitas...
          </p>
        </div>
      ) : entities.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Building2 size={22} className="text-slate-400" />
          </div>

          <h3 className="font-semibold text-slate-700">
            Tidak ada data entitas ditemukan
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Coba gunakan kata kunci pencarian lainnya.
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      ) : (
        /* Data Table */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">Nama Entitas</th>
                  <th className="px-5 py-3 text-center">Tipe</th>
                  <th className="px-5 py-3 text-center">Segmen</th>
                  <th className="px-5 py-3 text-center">Wilayah</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {entities.map((entity) => (
                  <tr key={entity.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 text-left">
                      <p className="font-medium text-slate-800">
                        {entity.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center text-slate-600">
                      {entity.type}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          entity.segment === "B2G"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {entity.segment}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-slate-600">
                      {entity.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">
              Menampilkan {entities.length} data entitas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
