export type FoodType = "DESAYUNO" | "ALMUERZO" | "CENA" | "SNACK";

export interface FoodRecordRequestDto {
  nameFood: string;
  foodType: FoodType;
  description?: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
}

export interface FoodRecordResponseDto {
  id: number;
  nameFood: string;
  date: string; // "yyyy-MM-dd"
  hour: string; // "HH:mm:ss"
  foodType: FoodType;
  description: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  aptoDiabetico: boolean;
  aptoHipertenso: boolean;
}

export type FilterType = FoodType | "TODOS";

export const foodTypeLabel: Record<FoodType, string> = {
  DESAYUNO: "Desayuno",
  ALMUERZO: "Almuerzo",
  CENA: "Cena",
  SNACK: "Snack",
};

export const foodTypeBadgeClass: Record<FoodType, string> = {
  DESAYUNO: "bg-amber-50 text-amber-700",
  ALMUERZO: "bg-emerald-50 text-emerald-700",
  CENA: "bg-indigo-50 text-indigo-700",
  SNACK: "bg-sky-50 text-sky-700",
};
