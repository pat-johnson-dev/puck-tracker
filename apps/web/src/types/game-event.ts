import type { Tables, TablesInsert } from './database';

// Base types from database
export type GameEvent = Tables<'game_event'>;
export type GameEventInsert = TablesInsert<'game_event'>;
export type TeamRoster = Tables<'team_roster'>;
export type TeamRosterInsert = TablesInsert<'team_roster'>;

// Team type
export type Team = 'home' | 'away';

// Event types
export const EventType = {
  STOPPAGE: 'stoppage',
  GOAL: 'goal',
  SHOT: 'shot',
  PASS: 'pass',
  FACEOFF: 'faceoff',
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

// Stoppage subtypes
export const StoppageSubtype = {
  OFFSIDE: 'offside',
  ICING: 'icing',
  PENALTY: 'penalty',
  PERIOD_END: 'period_end',
  GAME_END: 'game_end',
  OTHER: 'other',
} as const;

export type StoppageSubtypeValue = (typeof StoppageSubtype)[keyof typeof StoppageSubtype];

// "Other" stoppage reasons
export const OtherStoppageReason = {
  INJURY: 'injury',
  PUCK_OUT_OF_PLAY: 'puck_out_of_play',
  NET_DISLODGED: 'net_dislodged',
  HIGH_STICK: 'high_stick',
  HAND_PASS: 'hand_pass',
  GOALIE_COVER: 'goalie_cover',
} as const;

export type OtherStoppageReasonValue =
  (typeof OtherStoppageReason)[keyof typeof OtherStoppageReason];

// Penalty types
export const PenaltyType = {
  TRIPPING: 'tripping',
  HOOKING: 'hooking',
  SLASHING: 'slashing',
  HOLDING: 'holding',
  INTERFERENCE: 'interference',
  ROUGHING: 'roughing',
  HIGH_STICKING: 'high_sticking',
  CROSS_CHECKING: 'cross_checking',
  BOARDING: 'boarding',
  CHARGING: 'charging',
  DELAY_OF_GAME: 'delay_of_game',
  TOO_MANY_MEN: 'too_many_men',
  OTHER: 'other',
} as const;

export type PenaltyTypeValue = (typeof PenaltyType)[keyof typeof PenaltyType];

// Detail types for each stoppage subtype
export type OffsideDetails = {
  playerCarrying?: string;
  playerOffside?: string;
};

export type IcingDetails = {
  player?: string;
};

export type PenaltyDetails = {
  player?: string;
  penaltyType?: PenaltyTypeValue;
  duration?: number; // in minutes
  penaltyShot?: boolean;
};

export type InjuryDetails = {
  player?: string;
};

export type PeriodEndDetails = {
  confirmed: boolean;
};

export type OtherStoppageDetails = {
  reason: OtherStoppageReasonValue;
  player?: string;
};

// Union type for all stoppage details
export type StoppageDetails =
  | OffsideDetails
  | IcingDetails
  | PenaltyDetails
  | InjuryDetails
  | PeriodEndDetails
  | OtherStoppageDetails;

// Goal details (for future use)
export type GoalDetails = {
  scorer?: string;
  assist1?: string;
  assist2?: string;
  shotType?: string;
};

// Faceoff details (for future use)
export type FaceoffDetails = {
  location?: string;
  wonBy?: Team;
  homePlayer?: string;
  awayPlayer?: string;
};
