export type Role = "ADMIN" | "SALES";
export type Segment = "B2G" | "B2B";
export type ActivityStatus = "VISITED" | "NOT_VISITED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  segment: Segment;
  region: string;
}

export interface Activity {
  id: string;
  segment: Segment;
  visitDate: string;
  status: ActivityStatus;
  entity: Entity;
  sales: Pick<User, "id" | "name" | "email">;
}

export interface DashboardFiltersState {
  search: string;
  segment: string;
  status: ActivityStatus | "";
  startDate: string;
  endDate: string;
}