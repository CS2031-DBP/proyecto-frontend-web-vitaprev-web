import { IconUserFilled } from "@tabler/icons-react";

interface ProfileHeaderProps {
  name: string;
  lastName: string;
}

export default function ProfileHeader({ name, lastName }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-center gap-6 mb-8">
      {/* Avatar */}
      <div className="relative w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center ring-2 ring-emerald-100 shadow-sm">
        <IconUserFilled className="text-emerald-600" size={36} />
      </div>

      {/* Texto */}
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500 mb-1">
          Perfil de usuario
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900">
          {name} {lastName}
        </h2>

        <p className="text-sm text-slate-500 mt-1">Mi espacio personal</p>
      </div>
    </header>
  );
}
