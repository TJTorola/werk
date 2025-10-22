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

export const getRecord = async (): Promise<Array<SetData & { date: Date }>> => {
  const data = await Deno.readTextFile('./record.csv');
  const rows = data.split('\n').map((row) => row.split(','));
  return rows
    .map(([workout, weightStr, repsStr, dateStr], idx) => {
      if (!WORKOUT_STRINGS.includes(workout)) {
        console.log(`Unknown workout '${workout}', skipping row<${idx}>`);
        return null;
      }
      const weight = parseInt(weightStr, 10);
      if (weight.toString() !== weightStr || weight < 0) {
        console.log(
          `Invalid weight value '${weightStr}', skipping row<${idx}>`,
        );
        return null;
      }
      const reps = parseInt(repsStr, 10);
      if (reps.toString() !== repsStr || reps < 0) {
        console.log(`Invalid reps value '${repsStr}', skipping row<${idx}>`);
        return null;
      }
      const date = new Date(dateStr);
      // @ts-expect-error ts doesn't like this date checking trickery
      if (isNaN(date)) {
        console.log(`Invalid date value '${dateStr}', skipping row<${idx}>`);
        return null;
      }

      return { workout, weight, reps, date };
    })
    .filter((row) => row !== null);
};

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
