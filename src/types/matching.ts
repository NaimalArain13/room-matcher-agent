export interface ParsedProfile {
    id: string
    city: string
    area: string
    budget_PKR: number
    sleep_schedule: string
    cleanliness: string
    noise_tolerance: string
    study_habits: string
    food_pref: string
    notes: string
  }
  
  export interface MatchShort {
    city: string
    area: string
    budget_PKR: number
    cleanliness: string
    sleep_schedule: string
  }
  
  export interface MatchResultItem {
    roommate_id: string
    score: number
    short: MatchShort
    red_flags: string[]
  }
  
  export interface MatchingResults {
    matches: MatchResultItem[]
    candidate_count: number
    used_fallback: boolean
    wingman: Record<string, string>
  }
  