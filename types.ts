
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

export interface AppConfig {
  team: {
    leader: number;
    dfx: number;
    pcbDevs: { backend: number; terminal: number; arch: number };
    studyDevs: { backend: number; terminal: number; arch: number };
    sharedFrontend: number;
    firmwareOs: number;
    coreBackend: number;
    test: number;
  };
  pcb: {
    schools: number;
    labs: number;
    units: number;
    status: string;
  };
  study: {
    schools: number;
    units: number;
    status: string;
  };
  constraints: string;
}

export interface StrategicPlan {
  roadmap: StrategicStep[];
  products: ProductOptimization[];
  advice: string;
}
