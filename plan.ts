import * as prompts from './prompts.ts';
import { writePlanLine } from './write.ts';

const planName = await prompts.planName();

while (true) {
  const workout = await prompts.workout();
  if (!workout) break;
  await writePlanLine(planName, workout);
}
