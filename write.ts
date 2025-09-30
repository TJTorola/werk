import { WORKOUT_STRINGS } from './workouts.ts';

type SetData = {
  workout: string;
  weight: number;
  reps: number;
};

export const writeLine = ({ workout, weight, reps }: SetData) =>
  Deno.writeTextFile(
    './record.csv',
    `${workout},${weight},${reps},${Date()}\n`,
    {
      append: true,
    },
  );

export const writePlanLine = (planName: string, workout: string) =>
  Deno.writeTextFile(`./plans/${planName}`, `${workout}\n`, {
    append: true,
  });

export const getPlans = async () => {
  const entries = await Array.fromAsync(Deno.readDir('./plans'));
  return entries.map((entry) => entry.name);
};

export const getPlan = async (file: string) => {
  const data = await Deno.readTextFile(`./plans/${file}`);
  return data
    .split('\n')
    .filter((workout) => WORKOUT_STRINGS.includes(workout));
};
