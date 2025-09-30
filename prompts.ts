import prompts from '@terkelg/prompts';
import { WORKOUT_STRINGS } from './workouts.ts';

export const workout = async (): Promise<string> => {
  const { workout } = await prompts({
    type: 'autocomplete',
    name: 'workout',
    message: 'Select a workout',
    choices: WORKOUT_STRINGS.map((title) => ({ title })),
    suggest: (input: string, choices: Array<{ title: string }>) =>
      Promise.resolve(
        choices.filter(({ title }) =>
          input
            .toLowerCase()
            .split(' ')
            .every((term) => title.toLowerCase().includes(term)),
        ),
      ),
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
