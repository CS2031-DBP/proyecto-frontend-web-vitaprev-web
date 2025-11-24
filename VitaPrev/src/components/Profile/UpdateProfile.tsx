import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import constants from "../common/constants";

export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  genre: string;
  weight: number;
  height: number;
  birthDate: string;
  allergies?: string;
  diabetic: boolean;
  hypertensive: boolean;
  glucoseLevel?: number;
  bloodPressure?: string;
}

interface EditForm {
  name: string;
  lastName: string;
  genre: string;
  birthDate: string;
  phone: string;
  weight: string;
  height: string;
  allergies: string;
  diabetic: boolean;
  hypertensive: boolean;
}

interface EditProfileFormProps {
  profile: UserProfile;
  onUpdated: (updated: UserProfile) => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  profile,
  onUpdated,
  onCancel,
}: EditProfileFormProps) {
  const [editForm, setEditForm] = useState<EditForm>({
    name: profile.name,
    lastName: profile.lastName,
    genre: profile.genre,
    birthDate: profile.birthDate,
    phone: profile.phone,
    weight: profile.weight != null ? profile.weight.toString() : "",
    height: profile.height != null ? profile.height.toString() : "",
    allergies: profile.allergies ?? "",
    diabetic: profile.diabetic,
    hypertensive: profile.hypertensive,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await axios.patch<UserProfile>(
        "/user/me",
        {
          name: editForm.name,
          lastName: editForm.lastName,
          genre: editForm.genre,
          birthDate: editForm.birthDate,
          phone: editForm.phone,
          weight:
            editForm.weight.trim() === ""
              ? undefined
              : Number(editForm.weight),
          height:
            editForm.height.trim() === ""
              ? undefined
              : Number(editForm.height),
          allergies: editForm.allergies,
          diabetic: editForm.diabetic,
          hypertensive: editForm.hypertensive,
        },
        {
          baseURL: constants.API_HOST,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated(res.data); // el padre actualiza el profile y cierra el modo edición
    } catch (err: any) {
      console.error("Error actualizando perfil", err);
      alert(
        err?.response?.data?.message ??
          "Ocurrió un error al actualizar tu perfil."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
    >
      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Nombre</label>
        <input
          name="name"
          value={editForm.name}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Apellido</label>
        <input
          name="lastName"
          value={editForm.lastName}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Teléfono</label>
        <input
          name="phone"
          value={editForm.phone}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Género</label>
        <input
          name="genre"
          value={editForm.genre}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Fecha de nacimiento</label>
        <input
          name="birthDate"
          value={editForm.birthDate}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Peso (kg)</label>
        <input
          name="weight"
          type="number"
          value={editForm.weight}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-600 mb-1">Altura (cm)</label>
        <input
          name="height"
          type="number"
          value={editForm.height}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col sm:col-span-2">
        <label className="text-slate-600 mb-1">Alergias</label>
        <input
          name="allergies"
          value={editForm.allergies}
          onChange={handleChange}
          className="p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          name="diabetic"
          checked={editForm.diabetic}
          onChange={handleToggle}
        />
        <span className="text-slate-700">Diabético</span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          name="hypertensive"
          checked={editForm.hypertensive}
          onChange={handleToggle}
        />
        <span className="text-slate-700">Hipertenso</span>
      </div>

      <div className="flex gap-3 mt-4 sm:col-span-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
