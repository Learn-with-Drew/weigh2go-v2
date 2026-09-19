// Typescript interface

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight: number;
  logged_date: string;
  created_at: string;
}

export interface WeightTrendPoint {
  date: string;
  average_weight: number;
  entry_count: number;
}

export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  logged_date: string;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  daily_calorie_target: number;
  weight_unit: string;
}

export interface DashboardSummary {
  date: string;
  total_calories_logged: number;
  daily_target: number;
  calories_remaining: number;
  weight_logged_today: number | null;
  days_logged_weight_this_week: number;
}