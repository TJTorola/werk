import { countdown } from './countdown.ts';
import * as prompts from './prompts.ts';
import { writeLine } from './write.ts';

while (true) {
  const workout = await prompts.workout();
  if (!workout) {
    break;
  }
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
