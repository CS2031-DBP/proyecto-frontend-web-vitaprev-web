import type { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import type { MetricasSaludResponseDto } from "./HealthMetrics";

interface MetricsHistoryProps {
  todayInput: string;

  filterDate: string;
  filterPesoMin: string;
  filterPesoMax: string;
  setFilterDate: (value: string) => void;
  setFilterPesoMin: (value: string) => void;
  setFilterPesoMax: (value: string) => void;
  resetFilters: () => void;

  metricasFiltradas: MetricasSaludResponseDto[];
  paginatedMetricas: MetricasSaludResponseDto[];
  loading: boolean;

  formatDate: (raw: string) => string;
  openEditModal: (m: MetricasSaludResponseDto) => void;

  showingFrom: number;
  showingTo: number;
  pageCount: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export default function MetricsHistory({
  todayInput,
  filterDate,
  filterPesoMin,
  filterPesoMax,
  setFilterDate,
  setFilterPesoMin,
  setFilterPesoMax,
  resetFilters,
  metricasFiltradas,
  paginatedMetricas,
  loading,
  formatDate,
  openEditModal,
  showingFrom,
  showingTo,
  pageCount,
  currentPage,
  setCurrentPage,
}: MetricsHistoryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* TÍTULO */}
      <h2 className="text-lg font-semibold text-slate-800 px-4 sm:px-5 py-3">
        Historial
      </h2>

      <div className="p-4 sm:p-6 space-y-4">
        {/* FILTROS */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                Fecha específica
              </label>
              <input
                type="date"
                value={filterDate}
                max={todayInput}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                Peso mínimo (kg)
              </label>
              <input
                type="number"
                min={0}
                value={filterPesoMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFilterPesoMin(v < 0 ? "0" : e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="70"
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                Peso máximo (kg)
              </label>
              <input
                type="number"
                min={0}
                value={filterPesoMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFilterPesoMax(v < 0 ? "0" : e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="80"
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* SOLO LIMPIAR */}
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition text-xs"
          >
            Limpiar filtros
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Los filtros se aplican automáticamente cuando cambias un valor.
        </p>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Fecha
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Peso (kg)
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Altura (cm)
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  IMC
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Presión
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Glucosa
                </th>
                <th className="text-right font-semibold text-slate-500 px-3 py-2">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {metricasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    {loading ? "Cargando..." : "No hay datos."}
                  </td>
                </tr>
              )}

              {paginatedMetricas.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2 text-slate-700">
                    {formatDate(m.recordDate)}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.weight.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{m.height}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.bmi?.toFixed(1) ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.bloodPressure ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.glucoseLevel != null
                      ? `${m.glucoseLevel} mg/dL`
                      : "—"}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => openEditModal(m)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN SHADCN */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
          <p>
            Mostrando {showingFrom}–{showingTo} de {metricasFiltradas.length}{" "}
            registros
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: pageCount }).map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(pageCount, prev + 1));
                  }}
                  aria-disabled={
                    currentPage === pageCount ||
                    metricasFiltradas.length === 0
                  }
                  className={
                    currentPage === pageCount ||
                    metricasFiltradas.length === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
