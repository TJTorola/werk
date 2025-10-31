import { mkdir, readdir, appendFile } from 'node:fs/promises';
import { WORKOUT_STRINGS } from './workouts.ts';

type SetData = {
  workout: string;
  weight: number;
  reps: number;
};

const getXdgDataHome = () => {
  const { XDG_DATA_HOME, HOME } = process.env;
  if (XDG_DATA_HOME) return XDG_DATA_HOME;
  if (!HOME) {
    throw new Error(
      'Cannot determine data directory without $XDG_DATA_HOME or $HOME',
    );
  }

  return `${HOME}/.local/share`;
};

const getDataPath = async () => {
  const dataPath = `${getXdgDataHome()}/werk`;
  const dataFile = Bun.file(dataPath);
  if (!(await dataFile.exists())) {
    await mkdir(dataPath, { recursive: true });
  } else if (!(await dataFile.stat().then((stat) => stat.isDirectory()))) {
    throw new Error(
      `Data Directory "${dataPath}" exists but is not a directory`,
    );
  }

  return dataPath;
};

let dataPath: null | string = null;
const cachedDataPath = async () => {
  if (dataPath) return dataPath;
  dataPath = await getDataPath();
  return dataPath;
};

const getPlanPath = async () => {
  const planPath = `${await cachedDataPath()}/plans`;
  const planFile = Bun.file(planPath);
  if (!(await planFile.exists())) {
    await mkdir(planPath, { recursive: true });
  } else if (!(await planFile.stat().then((stat) => stat.isDirectory()))) {
    throw new Error(
      `Plan Directory "${planPath}" exists but is not a directory`,
    );
  }

  return planPath;
};

let planPath: null | string = null;
const cachedPlanPath = async () => {
  if (planPath) return planPath;
  planPath = await getPlanPath();
  return planPath;
};

const getRecordCsvPath = async () => {
  const recordCsvPath = `${await cachedDataPath()}/record.csv`;
  const recordCsvFile = Bun.file(recordCsvPath);
  if (!(await recordCsvFile.exists())) {
    recordCsvFile.write(`${RECORD_HEADER}\n`);
  } else if (!(await recordCsvFile.stat().then((stat) => stat.isFile()))) {
    throw new Error(`Record CSV "${recordCsvPath}" exists but is not a file`);
  }

  return recordCsvPath;
};

const RECORD_HEADER = 'Workout,Weight,Reps,Date';
export const writeRecordLine = async ({ workout, weight, reps }: SetData) =>
  appendFile(
    await getRecordCsvPath(),
    `${workout},${weight},${reps},${Date()}\n`,
  );

export const getRecord = async (): Promise<Array<SetData & { date: Date }>> => {
  const text = await Bun.file(await getRecordCsvPath()).text();
  const rows = text.split('\n').map((row) => row.split(','));
  return rows
    .map(([workout, weightStr, repsStr, dateStr], idx) => {
      if (!workout || !WORKOUT_STRINGS.includes(workout)) {
        console.log(`Unknown workout '${workout}', skipping row<${idx}>`);
        return null;
      }
      const weight = parseInt(weightStr!, 10);
      if (weight.toString() !== weightStr || weight < 0) {
        console.log(
          `Invalid weight value '${weightStr}', skipping row<${idx}>`,
        );
        return null;
      }
      const reps = parseInt(repsStr!, 10);
      if (reps.toString() !== repsStr || reps < 0) {
        console.log(`Invalid reps value '${repsStr}', skipping row<${idx}>`);
        return null;
      }
      const date = new Date(dateStr || '');
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
  appendFile(`${await cachedPlanPath()}/${planName}`, `${workout}\n`);

export const getPlans = async () => readdir(await cachedPlanPath());

export const getPlan = async (file: string) => {
  const data = await Bun.file(`${await cachedPlanPath()}/${file}`).text();
  return data
    .split('\n')
    .filter((workout) => WORKOUT_STRINGS.includes(workout));
};
