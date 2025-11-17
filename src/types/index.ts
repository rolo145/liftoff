export type Category = 'men' | 'women';

export interface Team {
  id: string;
  name: string;
  category: Category;
  athlete1: string;
  athlete2: string;
}

export interface TeamPayload extends Omit<Team, 'id'> {}

export interface Result {
  id: string;
  teamId: string;
  snatchAthlete1: number;
  snatchAthlete2: number;
  cleanAthlete1: number;
  cleanAthlete2: number;
  wodTime: string;
  totalPoints?: number;
}

export interface ResultPayload extends Omit<Result, 'id'> {}

export interface Workout {
  id: string;
  description: string;
  standards: string;
  timeCap: string;
}

export interface ScheduleEntry {
  id: string;
  teamId: string;
  snatchTime: string;
  cleanJerkTime: string;
  wodTime: string;
}

export interface SchedulePayload extends Omit<ScheduleEntry, 'id'> {}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  category: Category;
  categoryLabel: string;
  athletes: string[];
  snatchTotal: number;
  snatchAthlete1: number;
  snatchAthlete2: number;
  cleanTotal: number;
  cleanAthlete1: number;
  cleanAthlete2: number;
  wodSeconds: number | null;
  totalPoints: number;
}
