import { WORKOUT_STRINGS } from './workouts.ts';

type SetData = {
  workout: string;
  weight: number;
  reps: number;
};

const stat = (path: string) =>
  Deno.stat(path).catch((err) => {
    if (err?.name === 'NotFound') {
      return null;
    }

    throw err;
  });

const getXdgDataHome = () => {
  const xdgDataHome = Deno.env.get('XDG_DATA_HOME');
  if (xdgDataHome) return xdgDataHome;
  const home = Deno.env.get('HOME');
  if (!home) {
    throw new Error(
      'Cannot determine data directory without $XDG_DATA_HOME or $HOME',
    );
  }

  return `${home}/.local/share`;
};

const getDataDir = async () => {
  const dataDir = `${getXdgDataHome()}/werk`;
  const dataDirStat = await stat(dataDir);
  if (!dataDirStat) {
    await Deno.mkdir(dataDir, { recursive: true });
  } else if (!dataDirStat.isDirectory) {
    throw new Error(
      `Data Directory "${dataDir}" exists but is not a directory`,
    );
  }

  return dataDir;
};

const getPlanDir = async () => {
  const planDir = `${await getDataDir()}/plans`;
  const planDirStat = await stat(planDir);
  if (!planDirStat) {
    await Deno.mkdir(planDir, { recursive: true });
  } else if (!planDirStat.isDirectory) {
    throw new Error(
      `Plan Directory "${planDir}" exists but is not a directory`,
    );
  }

  return planDir;
};

const getRecordCsvPath = async () => {
  const recordCsvPath = `${await getDataDir()}/record.csv`;

  const recordStat = await stat(recordCsvPath);
  if (!recordStat) {
    Deno.writeTextFile(recordCsvPath, `${RECORD_HEADER}\n`, {
      append: true,
    });
  } else if (!recordStat.isFile) {
    throw new Error(`Record CSV "${recordCsvPath}" exists but is not a file`);
  }

  return recordCsvPath;
};

const RECORD_HEADER = 'Workout,Weight,Reps,Date';
export const writeRecordLine = async ({ workout, weight, reps }: SetData) =>
  Deno.writeTextFile(
    await getRecordCsvPath(),
    `${workout},${weight},${reps},${Date()}\n`,
    {
      append: true,
    },
  );

export const getRecord = async (): Promise<Array<SetData & { date: Date }>> => {
  const data = await Deno.readTextFile(await getRecordCsvPath());
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

export const writePlanLine = async (planName: string, workout: string) =>
  Deno.writeTextFile(`${await getPlanDir()}/${planName}`, `${workout}\n`, {
    append: true,
  });

export const getPlans = async () => {
  const entries = await Array.fromAsync(Deno.readDir(await getPlanDir()));
  return entries.map((entry) => entry.name);
};

export const getPlan = async (file: string) => {
  const data = await Deno.readTextFile(`${await getPlanDir()}/${file}`);
  return data
    .split('\n')
    .filter((workout) => WORKOUT_STRINGS.includes(workout));
};
