import { countdown } from './countdown.ts';
import * as prompts from './prompts.ts';
import { writeLine, getPlan } from './fs.ts';

const usePlan = await prompts.usePlan();

let plannedWorkouts: Array<string> = [];
if (usePlan) {
  const selectedPlan = await prompts.selectedPlan();
  plannedWorkouts = await getPlan(selectedPlan);
}

while (true) {
  const workout = await prompts.workout(plannedWorkouts);
  if (!workout) {
    break;
  }

  // Filter the selected workout from planned since we have already selected it
  plannedWorkouts = plannedWorkouts.filter(
    (plannedWorkout) => plannedWorkout !== workout,
  );

  const restPeriod = await prompts.restPeriod();
  let continueWorkout = true;
  let weight = 50;
  let reps = 10;
  while (continueWorkout) {
    continueWorkout = false;
    weight = await prompts.weight(weight);
    if (weight === undefined) break;
    reps = await prompts.reps(reps);
    if (reps === undefined) break;
    await writeLine({ workout, reps, weight });
    continueWorkout = await prompts.continueWorkout(workout);
    if (continueWorkout) {
      await countdown(restPeriod);
    }
  }
}
