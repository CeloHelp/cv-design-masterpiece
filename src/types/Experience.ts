// src/types/Experience.ts
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  isPersonalProject: boolean;
  context?: string;
  problem?: string;
  activitiesAndTechnologies?: string;
  impact?: string;
}
