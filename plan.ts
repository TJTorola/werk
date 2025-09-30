import * as prompts from './prompts.ts';
import { writePlanLine } from './fs.ts';

const planName = await prompts.planName();

while (true) {
  const workout = await prompts.workout();
  if (!workout) break;
  await writePlanLine(planName, workout);
}
