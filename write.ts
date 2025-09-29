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
