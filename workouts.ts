type WorkoutConfig = {
  excludeStandard?: boolean;
  variants?: Array<string>;
};

type Equipment = string;
type Movement = string;

export const WORKOUTS: Record<Equipment, Record<Movement, WorkoutConfig>> = {
  BARBELL: {
    PRESS: {
      variants: ['NEUTRAL', 'INCLINE', 'DECLINE'],
    },
    DEADLIFT: { variants: ['ROMANIAN', 'SUMO', 'RACK PULL'] },
    SQUAT: {},
    CURL: {},
    'GOOD MORNING': {},
  },
  CABLE: {
    'DELT FLY': {},
    'CHEST FLY': {},
    ROW: { variants: ['TWO ARM', 'SINGLE ARM'], excludeStandard: true },
    'LAT PULLDOWN': {},
  },
  LANDMINE: {
    SQUAT: {},
  },
  DUMBELL: {
    PRESS: {},
    CURL: { variants: ['HAMMER'] },
    SQUAT: { variants: ['GOBLET', 'SPLIT'] },
  },
  KETTLEBELL: {
    SQUAT: {},
  },
  BODYWEIGHT: {
    SQUAT: { variants: ['PISTOL', 'SPLIT'] },
  },
};

export const WORKOUT_STRINGS = Object.entries(WORKOUTS).flatMap(
  ([equipment, value]) =>
    Object.entries(value).flatMap(([movement, config]) => [
      ...(config.excludeStandard ? [] : [`${equipment} - ${movement}`]),
      ...(config.variants || []).map(
        (variant) => `${equipment} - ${movement} (${variant})`,
      ),
    ]),
);
