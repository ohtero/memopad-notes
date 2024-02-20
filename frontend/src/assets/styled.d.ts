import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fontFamily: string;
    colors: {
      primary: string;
      secondary: string;
      highlight: string;
      primaryDark: string;
      secondaryLight: string;
    };
    shadows: {
      extraSmall: string;
      bottomSmall: string;
    };
  }
}
