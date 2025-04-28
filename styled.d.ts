import 'styled-components';
import { Theme } from './styles/theme'; // Adjust path if theme is elsewhere

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
} 