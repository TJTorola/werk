import * as prompts from './prompts/index.js';
import { WORKOUT_STRINGS } from './workouts.ts';
import { getPlans } from './fs.ts';

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

export const workout = (
  plannedWorkouts: Array<string> = [],
): Promise<string> => {
  let sortedWorkouts = WORKOUT_STRINGS;

  if (plannedWorkouts.length > 0) {
    // "Planning" a workout just sorts it to the top of the list, there is still the flexibility
    // to diverge from the plan by just selecting something else at any point.
    const unplannedWorkouts = WORKOUT_STRINGS.filter(
      (workout) => !plannedWorkouts.includes(workout),
    );
    sortedWorkouts = [...plannedWorkouts, '-----', ...unplannedWorkouts];
  }

  return prompts.autocomplete({
    name: 'workout',
    message: 'Select a workout',
    choices: sortedWorkouts.map((title) => ({ title })),
    suggest: spaceDelemitedTermFilter,
  });
};

export const restPeriod = (): Promise<number> =>
  prompts.number({
    name: 'restPeriod',
    message: 'How long to rest? (seconds)',
    min: 0,
    max: 3600, // Up to an hour (for greasing the groove)
    increment: 15,
    initial: 60,
  });

export const weight = (initial: number = 0, increment: number = 5) =>
  prompts.number({
    name: 'weight',
    message: 'How much weight did you lift?',
    min: 0,
    max: 300,
    increment,
    initial,
  });

export const reps = (initial: number = 5) =>
  prompts.number({
    name: 'reps',
    message: 'How many reps did you do?',
    min: 0,
    max: 100,
    initial,
  });

export const continueWorkout = (workout: string) =>
  prompts.confirm({
    type: 'confirm',
    name: 'continueWorkout',
    message: `Continue with ${workout}?`,
    initial: true,
  });

const PLAN_REGEX = /[^a-z0-9-]/;
export const planName = () =>
  prompts.text({
    name: 'planName',
    message: 'Name for this plan?',
    validate: (value: string) =>
      PLAN_REGEX.test(value)
        ? 'Only lowercase "a-z", "0-9", and "-" allowed'
        : true,
  });

export const usePlan = () =>
  prompts.confirm({
    name: 'usePlan',
    message: `Use a plan for this workout?`,
  });

export const selectedPlan = async (): Promise<string> => {
  const plans = await getPlans();
  return prompts.autocomplete({
    type: 'autocomplete',
    name: 'selectedPlan',
    message: 'Select a plan',
    choices: plans.map((title) => ({ title })),
    suggest: spaceDelemitedTermFilter,
  });
};
