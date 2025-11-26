import type { UserProfile } from "./UpdateProfile";

interface HealthInfoCardProps {
  profile: UserProfile;
  weightDisplay: string;
  heightDisplay: string;
  glucoseDisplay: string;
  bpDisplay: string;
}

export default function HealthInfoCard({
  profile,
  weightDisplay,
  heightDisplay,
  glucoseDisplay,
  bpDisplay,
}: HealthInfoCardProps) {
  return (
    <section className="p-6 rounded-2xl border border-emerald-100 shadow-sm bg-white transition hover:shadow-md hover:bg-emerald-50/30">
      <h3 className="text-lg font-semibold text-emerald-800 mb-4">
        Datos de salud
      </h3>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Peso</dt>
          <dd className="font-medium text-slate-800">
            {weightDisplay}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Altura</dt>
          <dd className="font-medium text-slate-800">
            {heightDisplay}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Diabetes</dt>
          <dd className="font-medium text-slate-800">
            {profile.diabetic ? "Sí" : "No"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Hipertensión</dt>
          <dd className="font-medium text-slate-800">
            {profile.hypertensive ? "Sí" : "No"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Glucosa</dt>
          <dd className="font-medium text-slate-800">
            {glucoseDisplay}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Presión arterial</dt>
          <dd className="font-medium text-slate-800">
            {bpDisplay}
          </dd>
        </div>
      </dl>
    </section>
  );
}
