export type MealType = "DESAYUNO" | "ALMUERZO" | "CENA" | "SNACK";

export interface FoodRecommendation {
  tipo: string;
  nombre: string;
  descripcion?: string;
  calorias?: string;
  ingredientes?: string;
  categoria_salud?: string;
  condiciones_restringidas?: string;
  apto_diabetico?: string;
  apto_hipertenso?: string;
  apto_intolerante?: string;
}

export interface RecommendationsResponse {
  vitaAI: any;
  tipo: string;
  cantidad: number;
  recomendaciones: FoodRecommendation[];
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
  tipo?: MealType;
  recommendations?: FoodRecommendation[];
  rawVitaAi?: any;
}

export const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: "DESAYUNO", label: "Desayuno" },
  { key: "ALMUERZO", label: "Almuerzo" },
  { key: "CENA", label: "Cena" },
  { key: "SNACK", label: "Snack" },
];

// Normaliza strings raros a booleano o null
export const parseBoolFlag = (raw?: string): boolean | null => {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();

  if (
    v === "false" ||
    v === "0" ||
    v === "no" ||
    v === "no apto" ||
    v === "no-apto" ||
    v === "n" ||
    v === "falso"
  ) {
    return false;
  }

  if (
    v === "true" ||
    v === "1" ||
    v === "si" ||
    v === "sí" ||
    v === "apto" ||
    v === "s" ||
    v === "verdadero"
  ) {
    return true;
  }

  return null;
};
