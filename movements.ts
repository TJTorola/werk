type Equipment =
  | 'barbell'
  | 'cable'
  | 'landmine'
  | 'dumbell'
  | 'kettlebell'
  | 'bodyweight'
  | 'rower';

// Muscle groups as they are useful for catagorizing workout fatigue. Reductive in reference to
// actual muscles and colloquially named for the purpose of attaining the broadest recognition
// rather than scientific rigor. This is obviously going to be potentially divisive.
type MuscleGroup =
  | 'biceps'
  | 'pecs'
  | 'forearms'
  | 'obliques'
  | 'abs'
  | 'quads'
  | 'delts'
  | 'traps'
  | 'rotator cuff'
  | 'lats'
  | 'triceps'
  | 'lower back'
  | 'glutes'
  | 'hamstrings'
  | 'calf';

// How shall we record a single set of this workout?
type RecordCatagory =
  | 'reps'
  | 'distance'
  | 'weightAndReps'
  | 'timedDistance'
  | 'timedReps';

type Movement = {
  equipment: Equipment[];
  muscleGroups: {
    primary: MuscleGroup[];
    secondary: MuscleGroup[];
  };
  // Multiple catagories possible
  recordCatagories: RecordCatagory[];
};

// It is hard to catagorize workouts in a DRY way I am finding. There are a lot of slight alterations
// in movement, equipment and strategy of the movement that are _mostly_ the same. And then those
// aspects all multiply upon one another to create a fairly explosively large list of workouts. I am trying
// here to balance a few different things. The main key is a single movement, that could be done on multiple
// different pieces of equipment, but to essentially the same effect as far as a body is concerned.
// This will still cause a lot of overlapping configuration, but at least things like muscle usage doesn't
// really change overtime, so once it's right, it's right.
export default {
  press: {
    equipment: ['barbell', 'dumbell'],
    muscleGroups: {
      primary: ['pecs'],
      secondary: [],
    },
    recordCatagories: ['weightAndReps'],
  },
  'incline press': {
    equipment: ['barbell', 'dumbell'],
    muscleGroups: {
      primary: ['pecs'],
      secondary: [],
    },
    recordCatagories: ['weightAndReps'],
  },
  'decline press': {
    equipment: ['barbell', 'dumbell'],
    muscleGroups: {
      primary: ['pecs'],
      secondary: [],
    },
    recordCatagories: ['weightAndReps'],
  },
  'overhead press': {
    equipment: ['barbell', 'dumbell'],
    muscleGroups: {
      primary: ['pecs'],
      secondary: [],
    },
    recordCatagories: ['weightAndReps'],
  },
} as Record<string, Movement>;
