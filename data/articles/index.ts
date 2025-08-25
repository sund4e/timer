import { pomodoroTechnique } from './pomodoro-technique';
import { scienceOfProductivity } from './science-of-productivity';
import { timedLearningForKids } from './timed-learning-for-kids';
import { Article } from './types';

export type { Article } from './types';

export const articles: Article[] = [
  pomodoroTechnique,
  scienceOfProductivity,
  timedLearningForKids,
];
