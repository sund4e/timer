export type Theme = {
  colors: {
    dark: string;
    primary: string;
    highlight: string;
    accent: string;
    light: string;
  };
  fontSizes: {
    big: string;
  };
};
export const theme: Theme = {
  colors: {
    dark: '#141414',
    primary: '#182033',
    highlight: '#494F69',
    accent: '#975E6E',
    light: '#E8E8E8',
  },
  fontSizes: {
    big: '8vw',
  },
};
