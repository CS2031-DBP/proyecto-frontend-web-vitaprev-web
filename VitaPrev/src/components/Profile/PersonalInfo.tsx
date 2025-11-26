import type { UserProfile } from "./UpdateProfile";

interface PersonalInfoCardProps {
  profile: UserProfile;
}

export default function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  return (
    <section className="p-6 rounded-2xl border border-emerald-100 shadow-sm bg-white transition hover:shadow-md hover:bg-emerald-50/30">
      <h3 className="text-lg font-semibold text-emerald-800 mb-4">
        Datos personales
      </h3>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Correo</dt>
          <dd className="font-medium text-slate-800 text-right break-all">
            {profile.email}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Teléfono</dt>
          <dd className="font-medium text-slate-800">
            {profile.phone || "-"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Género</dt>
          <dd className="font-medium text-slate-800">
            {profile.genre || "-"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Fecha de nacimiento</dt>
          <dd className="font-medium text-slate-800">
            {profile.birthDate
            ? profile.birthDate.split("-").reverse().join("-")
            : "-"}
          </dd>

        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Alergias</dt>
          <dd className="font-medium text-slate-800">
            {profile.allergies && profile.allergies.trim().length > 0
              ? profile.allergies
              : "-"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
