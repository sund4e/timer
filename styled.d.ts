import 'styled-components';
import { Theme } from './styles/theme'; // Adjust path if theme is elsewhere

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 