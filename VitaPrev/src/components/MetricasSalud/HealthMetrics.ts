export interface MetricasSaludResponseDto {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  glucoseLevel: number | null;
  bloodPressure: string | null;
  recordDate: string;
}

export interface MetricasSaludRequestDto {
  weight: number;
  height: number;
  glucoseLevel: number | null;
  bloodPressure: string | null;
}

export type MetricsMode = "create" | "edit";