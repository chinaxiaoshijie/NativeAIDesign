
export enum PhaseStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface StrategicStep {
  id: string;
  title: string;
  duration: string;
  goal: string;
  actions: string[];
  status: PhaseStatus;
}

export interface ProductOptimization {
  productName: string;
  currentTech: string;
  aiNativeTarget: string;
  keyMoves: string[];
}
