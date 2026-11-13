import { X } from "lucide-react";
import type { ActivityStatus } from "../../types";

interface EditStatusModalProps {
  entityName: string;
  currentStatus: ActivityStatus;
  onClose: () => void;
  onStatusChange: (status: ActivityStatus) => void;
}

export function EditStatusModal({
  entityName,
  currentStatus,
  onClose,
  onStatusChange,
}: EditStatusModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Ubah Status Kunjungan
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Pilih status{" "}
          <span className="font-semibold text-slate-700">{entityName}</span>
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onStatusChange("NOT_VISITED")}
            className={`w-full rounded-xl border p-3 text-left text-sm font-semibold transition ${
              currentStatus === "NOT_VISITED"
                ? "border-orange-300 bg-orange-50 text-orange-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Belum Dikunjungi
          </button>

          <button
            type="button"
            onClick={() => onStatusChange("VISITED")}
            className={`w-full rounded-xl border p-3 text-left text-sm font-semibold transition ${
              currentStatus === "VISITED"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Sudah Dikunjungi
          </button>
        </div>
      </div>
    </div>
  );
}
