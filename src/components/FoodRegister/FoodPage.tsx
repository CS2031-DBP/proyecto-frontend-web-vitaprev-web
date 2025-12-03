import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { AxiosError } from "axios";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

import FoodSidebar from "./FoodSideBar";
import FoodEmptyState from "./FoodEmpty";
import FoodFilterBar from "./FoodFilter";
import FoodRecordList from "./FoodRecordList";
import FoodRecordModal from "./FoodModal";

import type {
  FoodType,
  FoodRecordRequestDto,
  FoodRecordResponseDto,
  FilterType,
} from "./FoodTypes";

const FoodLogPage = () => {
  const [axiosApi] = useAxiosForApi();

  const [records, setRecords] = useState<FoodRecordResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameFood, setNameFood] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("DESAYUNO");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>("TODOS");

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosApi.get<FoodRecordResponseDto[]>("/registro-comida");
      setRecords(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      if (axiosErr.response?.status === 404) {
        setRecords([]);
      } else {
        setError(
          axiosErr.response?.data?.message ||
            "Ocurrió un error al obtener tus registros de comida."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(
    () =>
      filterType === "TODOS"
        ? records
        : records.filter((r) => r.foodType === filterType),
    [records, filterType]
  );

  const totalCalories = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + (r.calories ?? 0), 0),
    [filteredRecords]
  );

  const totalProtein = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + (r.protein ?? 0), 0),
    [filteredRecords]
  );

  const totalCarbs = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + (r.carbs ?? 0), 0),
    [filteredRecords]
  );

  const totalFats = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + (r.fats ?? 0), 0),
    [filteredRecords]
  );

  const resetForm = () => {
    setNameFood("");
    setFoodType("DESAYUNO");
    setDescription("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nameFood.trim()) {
      setFormError("Debes ingresar el nombre del alimento o plato.");
      return;
    }

    const payload: FoodRecordRequestDto = {
      nameFood: nameFood.trim(),
      foodType,
    };

    if (description.trim()) payload.description = description.trim();

    const toNum = (v: string): number | null =>
      v.trim() === "" || isNaN(Number(v)) ? null : Number(v);

    const cal = toNum(calories);
    const pro = toNum(protein);
    const car = toNum(carbs);
    const fat = toNum(fats);

    if (cal !== null) payload.calories = cal;
    if (pro !== null) payload.protein = pro;
    if (car !== null) payload.carbs = car;
    if (fat !== null) payload.fats = fat;

    setSubmitting(true);
    try {
      await axiosApi.post<FoodRecordResponseDto>("/registro-comida", payload);
      setIsModalOpen(false);
      resetForm();
      await fetchRecords();
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        axiosErr.response?.data?.message ||
        "No se pudo registrar la comida. Revisa los datos ingresados.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este registro?");
    if (!ok) return;
    try {
      await axiosApi.delete(`/registro-comida/${id}`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        axiosErr.response?.data?.message ||
        "No se pudo eliminar el registro. Inténtalo nuevamente.";
      setError(msg);
    }
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row gap-6">
        <FoodSidebar
          filteredCount={filteredRecords.length}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          totalCarbs={totalCarbs}
          totalFats={totalFats}
          onOpenModal={handleOpenModal}
        />

        <main className="flex-1 rounded-2xl bg-white border border-slate-100 px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <FoodFilterBar
            filterType={filterType}
            onChangeFilterType={setFilterType}
          />

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
              Cargando tus registros de comida...
            </div>
          ) : filteredRecords.length === 0 ? (
            <FoodEmptyState onOpenModal={handleOpenModal} />
          ) : (
            <FoodRecordList records={filteredRecords} onDelete={handleDelete} />
          )}

          <FoodRecordModal
            isOpen={isModalOpen}
            submitting={submitting}
            formError={formError}
            nameFood={nameFood}
            foodType={foodType}
            description={description}
            calories={calories}
            protein={protein}
            carbs={carbs}
            fats={fats}
            onChangeNameFood={setNameFood}
            onChangeFoodType={setFoodType}
            onChangeDescription={setDescription}
            onChangeCalories={setCalories}
            onChangeProtein={setProtein}
            onChangeCarbs={setCarbs}
            onChangeFats={setFats}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  );
};

export default FoodLogPage;
