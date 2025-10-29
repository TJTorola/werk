type WorkoutConfig = {
  excludeStandard?: boolean;
  variants?: Array<string>;
};

type Equipment = string;
type Movement = string;

export const WORKOUTS: Record<Equipment, Record<Movement, WorkoutConfig>> = {
  BARBELL: {
    PRESS: {
      variants: ['INCLINE', 'DECLINE'],
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
    'LAT RAISE': {},
    KICKBACKS: {},
    'CALF RAISE': {},
    'HIP ABDUCTION': {},
    'HIP ADDUCTION': {},
    'LEG CURL': {},
    'LEG EXTENSION': {},
    'OBLIQUE TWIST': { variants: ['INCLINE', 'DECLINE'] },
    'YES MOMMY': {},
  },
  LANDMINE: {
    SQUAT: {},
    'CALF RAISE': { variants: ['SINGLE LEG', 'HALF CALF'] },
    ROLLOUT: {},
    RAINBOW: {},
  },
  DUMBELL: {
    PRESS: { variants: ['INCLINE', 'DECLINE', 'OVERHEAD'] },
    CURL: { variants: ['HAMMER'] },
    'LAT RAISE': {},
    SQUAT: { variants: ['GOBLET', 'BULGARIAN', 'SPLIT'] },
  },
  KETTLEBELL: {
    SQUAT: {},
  },
  BODYWEIGHT: {
    DIP: { variants: ['BENCH'] },
    SQUAT: { variants: ['PISTOL', 'BULGARIAN', 'SPLIT'] },
    CRUNCH: {},
    'PULL UP': { variants: ['CHIN', 'NEUTRAL'] },
  },
  ROWER: {
    ROW: { variants: ['LOW RESISTANCE', 'MED RESISTANCE', 'HIGH RESISTANCE'] },
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
