import { pomodoroTechnique } from './pomodoro-technique';
import { scienceOfProductivity } from './science-of-productivity';
import { timedLearningForKids } from './timed-learning-for-kids';
import { the202020Rule } from './20-20-20-rule';
import { timedMeetings } from './timed-meetings';
import { cookingRice } from './cooking-rice';
import { Article } from './types';

export type { Article } from './types';

export const articles: Article[] = [
  pomodoroTechnique,
  scienceOfProductivity,
  timedLearningForKids,
  the202020Rule,
  timedMeetings,
  cookingRice,
];
