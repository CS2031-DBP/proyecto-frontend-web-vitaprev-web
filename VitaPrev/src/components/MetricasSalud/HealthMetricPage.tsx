import { useEffect, useMemo, useState } from "react";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

import MetricsHeader from "./MetricHeader";
import MetricsSummaryCards from "./MetricsSummaryCards";
import MetricsHistory from "./MetricHistory";
import MetricsModal from "./MetricsModal";

import type {
  MetricasSaludResponseDto,
  MetricasSaludRequestDto,
  MetricsMode,
} from "./HealthMetrics";

const ITEMS_PER_PAGE = 8;

const HealthMetricsPage = () => {
  const [axiosApi] = useAxiosForApi();

  const [metricas, setMetricas] = useState<MetricasSaludResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<MetricsMode>("create");
  const [editingMetric, setEditingMetric] =
    useState<MetricasSaludResponseDto | null>(null);

  const [form, setForm] = useState({
    weight: "",
    height: "",
    glucoseLevel: "",
    bloodPressure: "",
  });

  // Filtros / paginación
  const [filterDate, setFilterDate] = useState("");
  const [filterPesoMin, setFilterPesoMin] = useState("");
  const [filterPesoMax, setFilterPesoMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const today = new Date();
  const todayInput = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // ========= PARSERS ==========

  const parseLocalDate = (raw: string) => {
    if (!raw) return null;

    if (raw.length === 10 && raw.includes("-")) {
      const [y, m, d] = raw.split("-").map(Number);
      return new Date(y, m - 1, d, 23, 59, 59);
    }

    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (raw: string) => {
    if (!raw) return "—";

    const date = parseLocalDate(raw);
    if (!date) return "—";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = date.getFullYear();

    return `${dd}/${mm}/${yy}`;
  };

  const normalizeToInputDate = (raw: string) => {
    if (!raw) return "";

    const date = parseLocalDate(raw);
    if (!date) return "";

    return date.toISOString().split("T")[0];
  };

  const timeAgo = (raw: string) => {
    const date = parseLocalDate(raw);
    if (!date) return "—";

    const now = new Date();

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) return "Hoy";

    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );

    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isYesterday) return "Ayer";

    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "Justo ahora";
    if (minutes < 60) return `Hace ${minutes} minuto${minutes === 1 ? "" : "s"}`;
    if (hours < 24) return `Hace ${hours} hora${hours === 1 ? "" : "s"}`;
    if (days < 7) return `Hace ${days} día${days === 1 ? "" : "s"}`;
    if (weeks < 5) return `Hace ${weeks} semana${weeks === 1 ? "" : "s"}`;

    return formatDate(raw);
  };

  // =============== API ===============

  const loadMetricas = async () => {
    try {
      setLoading(true);
      const res = await axiosApi.get<MetricasSaludResponseDto[]>("/metricas");
      setMetricas(res.data);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 404) setMetricas([]);
      else setError("No se pudieron cargar tus métricas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetricas();
  }, []);

  const metricasOrdenadas = useMemo(
    () =>
      [...metricas].sort(
        (a, b) =>
          parseLocalDate(b.recordDate)!.getTime() -
          parseLocalDate(a.recordDate)!.getTime()
      ),
    [metricas]
  );

  const ultimaMetrica = metricasOrdenadas[0];

  // =============== MODAL ===============

  const openCreateModal = () => {
    setModalMode("create");
    setEditingMetric(null);
    setForm({ weight: "", height: "", glucoseLevel: "", bloodPressure: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (m: MetricasSaludResponseDto) => {
    setModalMode("edit");
    setEditingMetric(m);
    setForm({
      weight: m.weight.toString(),
      height: m.height.toString(),
      glucoseLevel: m.glucoseLevel != null ? m.glucoseLevel.toString() : "",
      bloodPressure: m.bloodPressure ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildRequestBody = (): MetricasSaludRequestDto => ({
    weight: Number(form.weight),
    height: Number(form.height),
    glucoseLevel:
      form.glucoseLevel.trim() === "" ? null : Number(form.glucoseLevel),
    bloodPressure:
      form.bloodPressure.trim() === "" ? null : form.bloodPressure.trim(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = buildRequestBody();

      if (modalMode === "create") {
        await axiosApi.post("/metricas", body);
      } else if (editingMetric) {
        await axiosApi.put(`/metricas/${editingMetric.id}`, body);
      }

      await loadMetricas();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  // =============== FILTROS ===============

  const metricasFiltradas = useMemo(() => {
    let result = metricasOrdenadas;

    if (filterDate) {
      result = result.filter(
        (m) => normalizeToInputDate(m.recordDate) === filterDate
      );
    }

    const min = filterPesoMin ? Math.max(0, Number(filterPesoMin)) : 0;
    const max = filterPesoMax ? Math.max(min, Number(filterPesoMax)) : Infinity;

    result = result.filter((m) => m.weight >= min && m.weight <= max);

    return result;
  }, [metricasOrdenadas, filterDate, filterPesoMin, filterPesoMax]);

  const resetFilters = () => {
    setFilterDate("");
    setFilterPesoMin("");
    setFilterPesoMax("");
    setCurrentPage(1);
  };

  // =============== PAGINACIÓN (CLIENT-SIDE) ===============

  useEffect(() => {
    const newPageCount = Math.max(
      1,
      Math.ceil(metricasFiltradas.length / ITEMS_PER_PAGE)
    );
    setPageCount(newPageCount);
    setCurrentPage((prev) => Math.min(prev, newPageCount));
  }, [metricasFiltradas.length]);

  const startIndex =
    metricasFiltradas.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex =
    metricasFiltradas.length === 0
      ? 0
      : Math.min(startIndex + ITEMS_PER_PAGE, metricasFiltradas.length);

  const paginatedMetricas = useMemo(
    () => metricasFiltradas.slice(startIndex, endIndex),
    [metricasFiltradas, startIndex, endIndex]
  );

  const showingFrom = metricasFiltradas.length === 0 ? 0 : startIndex + 1;
  const showingTo = metricasFiltradas.length === 0 ? 0 : endIndex;

  // =============== IMC ===============

  const pesoActual = ultimaMetrica?.weight ?? null;
  const imcActual = ultimaMetrica?.bmi ?? null;

  const getImcEstado = () => {
    if (imcActual == null)
      return { label: "—", color: "bg-slate-200 text-slate-700" };
    if (imcActual < 18.5)
      return { label: "Bajo peso", color: "bg-amber-50 text-amber-700" };
    if (imcActual < 25)
      return { label: "Normal", color: "bg-emerald-50 text-emerald-700" };
    if (imcActual < 30)
      return { label: "Sobrepeso", color: "bg-orange-50 text-orange-700" };
    return { label: "Obesidad", color: "bg-rose-50 text-rose-700" };
  };

  const imcEstado = getImcEstado();

  return (
    <div className="space-y-6">
      <MetricsHeader onCreateClick={openCreateModal} />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      <MetricsSummaryCards
        ultimaMetrica={ultimaMetrica}
        pesoActual={pesoActual}
        imcActual={imcActual}
        imcEstado={imcEstado}
        formatDate={formatDate}
        timeAgo={timeAgo}
      />

      <MetricsHistory
        todayInput={todayInput}
        filterDate={filterDate}
        filterPesoMin={filterPesoMin}
        filterPesoMax={filterPesoMax}
        setFilterDate={setFilterDate}
        setFilterPesoMin={setFilterPesoMin}
        setFilterPesoMax={setFilterPesoMax}
        resetFilters={resetFilters}
        metricasFiltradas={metricasFiltradas}
        paginatedMetricas={paginatedMetricas}
        loading={loading}
        formatDate={formatDate}
        openEditModal={openEditModal}
        showingFrom={showingFrom}
        showingTo={showingTo}
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <MetricsModal
        isOpen={isModalOpen}
        mode={modalMode}
        loading={loading}
        form={form}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default HealthMetricsPage;
