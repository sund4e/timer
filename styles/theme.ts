export type Theme = {
  colors: {
    dark: string;
    primary: string;
    highlight: string;
    accent: string;
    light: string;
  };
  fontSizes: {
    big: number;
    medium: number;
    small: number;
  };
  transition: number;
  radius: number;
};
export const theme: Theme = {
  colors: {
    dark: '#141414',
    primary: '#182033',
    highlight: '#494F69',
    accent: '#98473E',
    light:  '#C9C5CB'
  },
  fontSizes: {
    big: 10,
    medium: 2,
    small: 0.75,
  },
  transition: 0.4,
  radius: 0.5,
};
