import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import AuthTabs from "./Authtabs";
import DatePicker from "react-datepicker";


export default function RegisterPage() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [genre, setGenre] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diabetic, setDiabetic] = useState(false);
  const [hypertensive, setHypertensive] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastGlucose, setLastGlucose] = useState("");
  const [lastPressure, setLastPressure] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();


  const handleRegister = (e: SyntheticEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden");
    return;
  }

  if (!birthDate) {
    setError("La fecha de nacimiento es obligatoria");
    return;
  }

  if (diabetic && lastGlucose.trim() === "") {
    setError("Ingresa tu último registro de glucosa");
    return;
  }

  if (hypertensive && lastPressure.trim() === "") {
    setError("Ingresa tu último registro de presión arterial");
    return;
  }

  auth
    .register(
      name,
      lastName,
      email,
      phone,
      genre,
      Number(weight),
      Number(height),
      birthDate,
      allergies,
      diabetic,
      hypertensive,
      lastGlucose,
      lastPressure,
      password
    )
    .then(() => navigate("/dashboard", { replace: true }))
    .catch((err: AxiosError) => {
      console.error("Signup error:", err.response?.status, err.response?.data);
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Error al registrarse"
      );
    });
};



  return (
    <div className="flex justify-center bg-emerald-50 py-10 min-h-[80vh]">
      <div className="w-full max-w-5xl grid grid-cols-1 auto-rows-max gap-8 p-4 justify-items-center">
    
        <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col justify-start">

          <AuthTabs />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Personaliza tu experiencia en VitaPrev 💚
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configura tus datos básicos y de salud para recomendaciones personalizadas.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-sm">

            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Nombre</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Apellidos</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email & Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Correo</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={email}
                  placeholder="tucorreo@ejemplo.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Teléfono</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Género - Fecha - Peso - Altura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Género */}
            <div>
                <label className="block text-slate-700 mb-1">Género</label>
                <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                </select>
            </div>

            {/* Fecha nacimiento */}
            <div>
                <label className="block text-slate-700 mb-1">Fecha de nacimiento</label>

                <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-MM-yyyy"
                minDate={new Date(1900, 0, 1)}
                maxDate={new Date()}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {/* Peso */}
            <div>
                <label className="block text-slate-700 mb-1">Peso (kg)</label>
                <input
                type="number"
                min={0}
                max={300}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={weight}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) return;
                    setWeight(e.target.value);
                }}
                />
            </div>

            {/* Altura */}
            <div>
                <label className="block text-slate-700 mb-1">Altura (cm)</label>
                <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                />
            </div>

            </div>


            

            {/* Alergias */}
            <div>
              <label className="block text-slate-700 mb-1">Alergias</label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ej. maní, mariscos..."
              />
            </div>

            {/* Diabetes / Hipertensión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-700 mb-1">¿Diabetes?</p>
                <div className="flex gap-2">
                    
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      diabetic
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setDiabetic(true)}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      !diabetic
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setDiabetic(false)}
                  >
                    No
                  </button>
                </div>
                {diabetic && (
                    <div className="mt-2">
                        <label className="block text-slate-700 mb-1">
                        Último registro de glucosa (mg/dL)
                        </label>
                        <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        value={lastGlucose}
                        min={0}
                        onChange={(e) => setLastGlucose(e.target.value)}
                        />
                    </div>
                    )}
                </div>

              <div>
                <p className="text-slate-700 mb-1">¿Hipertensión?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      hypertensive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setHypertensive(true)}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      !hypertensive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setHypertensive(false)}
                  >
                    No
                  </button>
                </div>
                {hypertensive && (
                <div className="mt-2">
                    <label className="block text-slate-700 mb-1">
                    Último registro de presión arterial (mmHg)
                    </label>
                    <input
                    type="text"
                    placeholder="Ej. 120/80"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                    value={lastPressure}
                    onChange={(e) => setLastPressure(e.target.value)}
                    />
                </div>
                )}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Confirmar contraseña */}
            <div>
                <label className="block text-slate-700 mb-1">Confirmar contraseña</label>
                <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="w-full mt-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              Crear cuenta
            </button>
          </form>

          <p className="mt-5 text-[12px] text-slate-500 text-center">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/signin" className="text-emerald-600 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
