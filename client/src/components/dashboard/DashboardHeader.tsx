import { LogOut, UserRound } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src="/logo.png" />
          </div>

          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-800">
              VISIT <span className="text-orange-500">FLOW</span>
            </h1>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <UserRound size={18} />
            </div>

            <div className="max-w-[160px]">
              <p className="truncate text-sm font-semibold text-slate-700">
                {userName}
              </p>
              <p className="text-[11px] text-slate-400">Pengguna aktif</p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            onClick={onLogout}
            className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.97]"
          >
            <LogOut
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
