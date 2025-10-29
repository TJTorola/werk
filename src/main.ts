import { countdown } from './countdown.ts';
import * as prompts from './prompts.ts';
import { writeRecordLine, getPlan, getRecord } from './fs.ts';

const usePlan = await prompts.usePlan();

let plannedWorkouts: Array<string> = [];
if (usePlan) {
  const selectedPlan = await prompts.selectedPlan();
  plannedWorkouts = await getPlan(selectedPlan);
}

const records = await getRecord();

while (true) {
  console.clear();
  const workout = await prompts.workout(plannedWorkouts);
  if (!workout) {
    break;
  }

  // Filter the selected workout from planned since we have already selected it
  plannedWorkouts = plannedWorkouts.filter(
    (plannedWorkout) => plannedWorkout !== workout,
  );

  const restPeriod = await prompts.restPeriod();
  records
    .filter((record) => record.workout === workout)
    .forEach((record) =>
      console.log(
        `${record.date.toLocaleString()} - Weight: ${record.weight.toString().padStart(3, '0')} - Reps: ${record.reps.toString().padStart(2, '0')}`,
      ),
    );

  let continueWorkout = true;
  let weight = 50;
  let reps = 10;
  while (continueWorkout) {
    continueWorkout = false;
    weight = await prompts.weight(weight);
    if (weight === undefined) break;
    reps = await prompts.reps(reps);
    if (reps === undefined) break;
    await writeRecordLine({ workout, reps, weight });
    continueWorkout = await prompts.continueWorkout(workout);
    if (continueWorkout) {
      await countdown(restPeriod);
    }
  }
}
