import { useEffect, useState } from "react";
import { Search, X, CalendarPlus } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../services/api";

interface Entity {
  id: string;
  name: string;
  type: string;
  segment: "B2G" | "B2B";
  region: string;
}

interface CreateVisitModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateVisitModal({
  onClose,
  onSuccess,
}: CreateVisitModalProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const [search, setSearch] = useState("");
  const [visitDate, setVisitDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Mengambil data entitas
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const { data } = await api.get("/entity", {
          params: {
            ...(search.trim() && {
              search: search.trim(),
            }),
          },
        });

        setEntities(data.data ?? []);
      } catch {
        toast.error("Gagal mengambil data entitas.");
        setEntities([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // Submit rencana kunjungan
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedEntity) {
      toast.error("Silakan pilih entitas terlebih dahulu.");
      return;
    }

    if (!visitDate) {
      toast.error("Tanggal kunjungan wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/activities", {
        entityId: selectedEntity.id,
        segment: selectedEntity.segment,
        visitDate,
      });

      toast.success("Rencana kunjungan berhasil ditambahkan.");

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan rencana kunjungan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Tambah Rencana Kunjungan
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Lengkapi informasi rencana kunjungan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Pilih Entitas */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Entitas
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={selectedEntity ? selectedEntity.name : search}
                  onChange={(e) => {
                    setSelectedEntity(null);
                    setSearch(e.target.value);
                    setShowOptions(true);
                  }}
                  onFocus={() => {
                    if (!selectedEntity) {
                      setShowOptions(true);
                    }
                  }}
                  placeholder="Cari nama entitas..."
                  autoComplete="off"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  required={!selectedEntity}
                />

                {selectedEntity && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEntity(null);
                      setSearch("");
                      setShowOptions(true);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Entity Options */}
              {showOptions && !selectedEntity && (
                <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                  {loading ? (
                    <p className="p-4 text-center text-xs text-slate-500">
                      Mencari entitas...
                    </p>
                  ) : entities.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-500">
                      Entitas tidak ditemukan.
                    </p>
                  ) : (
                    entities.map((entity) => (
                      <button
                        key={entity.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntity(entity);
                          setSearch("");
                          setShowOptions(false);
                        }}
                        className="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-orange-50"
                      >
                        <p className="text-sm font-medium text-slate-800">
                          {entity.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {entity.type} • {entity.region}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedEntity && (
                <p className="mt-2 text-xs text-green-600">
                  Entitas berhasil dipilih.
                </p>
              )}
            </div>

            {/* Segment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Segment
              </label>

              <input
                type="text"
                value={selectedEntity?.segment || ""}
                placeholder="Otomatis mengikuti entitas"
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none"
              />
            </div>

            {/* Tanggal Kunjungan */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal Kunjungan
              </label>

              <div className="relative">
                <CalendarPlus
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting || !selectedEntity || !visitDate}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Rencana"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
