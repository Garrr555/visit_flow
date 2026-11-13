import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../services/api";

interface CreateEntityModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface EntityForm {
  name: string;
  type: string;
  segment: "B2G" | "B2B";
  region: string;
}

const initialForm: EntityForm = {
  name: "",
  type: "",
  segment: "B2G",
  region: "",
};

export function CreateEntityModal({
  onClose,
  onSuccess,
}: CreateEntityModalProps) {
  const [form, setForm] = useState<EntityForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);

    try {
      await api.post("/entity", form);

      toast.success("Entitas berhasil ditambahkan");

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambahkan entitas");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tambah Entitas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan informasi entitas baru.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nama Entitas
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dinas Pendidikan"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tipe Entitas
            </label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Dinas, Perusahaan, Sekolah"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Segment
            </label>
            <select
              name="segment"
              value={form.segment}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="B2G">B2G</option>
              <option value="B2B">B2B</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Region
            </label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="Jawa Barat"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan Entitas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
