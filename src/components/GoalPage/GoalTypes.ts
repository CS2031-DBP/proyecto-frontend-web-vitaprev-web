export type GoalDirection = "AUMENTO" | "DISMINUCION";
export type GoalType = "PESO" | "GLUCOSA" | "PRESION";
export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface GoalRequestDto {
  currentValue?: number | null;
  targetValue: number;
  direction: GoalDirection;
  type: GoalType;
  deadline: string;
}

export interface GoalResponseDto {
  id: number;
  currentValue: number | null;
  targetValue: number;
  progress: number;
  deadline: string;
  status: GoalStatus;
}
