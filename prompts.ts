import prompts from '@terkelg/prompts';
import { WORKOUT_STRINGS } from './workouts.ts';
import { getPlans } from './write.ts';

const spaceDelemitedTermFilter = (
  input: string,
  choices: Array<{ title: string }>,
) =>
  Promise.resolve(
    choices.filter(({ title }) =>
      input
        .toLowerCase()
        .split(' ')
        .every((term) => title.toLowerCase().includes(term)),
    ),
  );

export const workout = async (
  plannedWorkouts: Array<string> = [],
): Promise<string> => {
  // "Planning" a workout just sorts it to the top of the list, there is still the flexibility
  // to diverge from the plan by just selecting something else at any point.
  const unplannedWorkouts = WORKOUT_STRINGS.filter(
    (workout) => !plannedWorkouts.includes(workout),
  );
  const sortedWorkouts = [...plannedWorkouts, ...unplannedWorkouts];

  const { workout } = await prompts({
    type: 'autocomplete',
    name: 'workout',
    message: 'Select a workout',
    choices: sortedWorkouts.map((title) => ({ title })),
    suggest: spaceDelemitedTermFilter,
  });
  return workout;
};

export const restPeriod = async (): Promise<number> => {
  const { restPeriod } = await prompts({
    type: 'number',
    name: 'restPeriod',
    message: 'How long to rest? (seconds)',
    min: 0,
    max: 600,
    increment: 15,
    initial: 60,
  });
  return restPeriod;
};

export const weight = async (initial: number = 0, increment: number = 5) => {
  const { weight } = await prompts({
    type: 'number',
    name: 'weight',
    message: 'How much weight did you lift?',
    min: 0,
    max: 300,
    increment,
    initial,
  });
  return weight;
};

export const reps = async (initial: number = 5) => {
  const { reps } = await prompts({
    type: 'number',
    name: 'reps',
    message: 'How many reps did you do?',
    min: 0,
    max: 100,
    initial,
  });
  return reps;
};

export const continueWorkout = async (workout: string) => {
  const { continueWorkout } = await prompts({
    type: 'confirm',
    name: 'continueWorkout',
    message: `Continue with ${workout}?`,
    initial: true,
  });
  return continueWorkout;
};

const PLAN_REGEX = /[^a-z0-9-]/;
export const planName = async () => {
  const { planName } = await prompts({
    type: 'text',
    name: 'planName',
    message: 'Name for this plan?',
    validate: (value: string) =>
      PLAN_REGEX.test(value)
        ? 'Only lowercase "a-z", "0-9", and "-" allowed'
        : true,
  });
  return planName;
};

export const usePlan = async () => {
  const { usePlan } = await prompts({
    type: 'confirm',
    name: 'usePlan',
    message: `Use a plan for this workout?`,
  });
  return usePlan;
};

export const selectedPlan = async (): Promise<string> => {
  const plans = await getPlans();
  const { selectedPlan } = await prompts({
    type: 'autocomplete',
    name: 'selectedPlan',
    message: 'Select a plan',
    choices: plans.map((title) => ({ title })),
    suggest: spaceDelemitedTermFilter,
  });
  return selectedPlan;
};
