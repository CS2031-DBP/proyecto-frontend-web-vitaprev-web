import { useEffect, useState } from "react";
import axios from "axios";
import constants from "../common/constants";
import EditProfileForm, { type UserProfile } from "./UpdateProfile";
import PersonalInfoCard from "./PersonalInfo";
import HealthInfoCard from "./HealthInfo";
import ProfileSummary from "./Summary";
import ProfileHeader from "./Header";


export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get<UserProfile>("/user/me", {
        baseURL: constants.API_HOST,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-emerald-600">
        Cargando perfil...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Error al cargar perfil.
      </div>
    );

  const weightDisplay =
    profile.weight != null ? `${profile.weight} kg` : "-";

  const heightDisplay =
    profile.height != null ? `${profile.height} cm` : "-";

  const glucoseDisplay =
    profile.glucoseLevel != null ? `${profile.glucoseLevel} mg/dL` : "-";

  const bpDisplay =
    profile.bloodPressure && profile.bloodPressure.trim().length > 0
      ? profile.bloodPressure
      : "-";

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 py-10 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white border border-emerald-100 shadow-xl shadow-emerald-100/60 rounded-3xl p-6 sm:p-8 md:p-10">
        {/* HEADER */}
        <ProfileHeader name={profile.name} lastName={profile.lastName} />
        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-emerald-100 to-transparent mb-8" />

        {/* FORM EDICIÓN */}
        {isEditing && (
          <EditProfileForm
            profile={profile}
            onUpdated={(updated) => {
              setProfile(updated);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {/* Vista solo cuando NO estás editando */}
        {!isEditing && (
          <>
            {/* 🔹 Resumen rápido ahora es un componente */}
            <ProfileSummary
              weightDisplay={weightDisplay}
              heightDisplay={heightDisplay}
              glucoseDisplay={glucoseDisplay}
              bpDisplay={bpDisplay}
            />

            {/* GRID PRINCIPAL */}
            <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PersonalInfoCard profile={profile} />

              <HealthInfoCard
                profile={profile}
                weightDisplay={weightDisplay}
                heightDisplay={heightDisplay}
                glucoseDisplay={glucoseDisplay}
                bpDisplay={bpDisplay}
              />
            </main>

            {/* BOTÓN EDITAR */}
            <footer className="mt-10 flex flex-col sm:flex-row justify-between gap-3">
              <div className="flex gap-3 justify-end w-full sm:w-auto">
                <button
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 transition"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
