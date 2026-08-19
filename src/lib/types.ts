export interface DailyEntry {
  date: string;
  food_log: string;
  night_activity: string;
  bedtime: string;
  exercised: boolean;
  exercise_activity: string;
  exercise_minutes: number;
  trouble_falling_asleep: boolean;
  woke_in_night: boolean;
  wake_count: number;
  notes: string;
  last_updated: string;
}

export const EMPTY_ENTRY: Omit<DailyEntry, 'date'> = {
  food_log: '',
  night_activity: '',
  bedtime: '',
  exercised: false,
  exercise_activity: '',
  exercise_minutes: 0,
  trouble_falling_asleep: false,
  woke_in_night: false,
  wake_count: 0,
  notes: '',
  last_updated: '',
};
