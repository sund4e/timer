export enum Input {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
}
export type Hms = {
  [Input.hours]: number;
  [Input.minutes]: number;
  [Input.seconds]: number;
};
export const getHms = (seconds: number): Hms => {
  return {
    [Input.hours]: Math.floor(seconds / 3600),
    [Input.minutes]: Math.floor((seconds % 3600) / 60),
    [Input.seconds]: Math.floor((seconds % 3600) % 60),
  };
};

export const getSeconds = (hms: Hms) => {
  return hms[Input.hours] * 3600 + hms[Input.minutes] * 60 + hms[Input.seconds];
};
