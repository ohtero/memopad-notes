import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fontFamily: string;
    colors: {
      background: string;
      menuBackground: string;
      main: string;
      secondary: string;
      highlight: string;
      offWhite: string;
    };
    shadows: {
      extraSmall: string;
      bottomSmall: string;
    };
  }
}
