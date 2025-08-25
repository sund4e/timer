import { pomodoroTechnique } from './pomodoro-technique';
import { masteringPomodoro } from './mastering-pomodoro';
import { twentyTwentyRule } from './20-20-20-rule';
import { storyBehindAika } from './story-behind-aika';
import { Article } from './types';

export type { Article } from './types';

export const articles: Article[] = [
  pomodoroTechnique,
  masteringPomodoro,
  twentyTwentyRule,
  storyBehindAika,
];
