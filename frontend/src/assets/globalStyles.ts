import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
*, *::before, *::after {
  margin: 0;
  box-sizing: border-box;
}
#root {
  font-family: ${(props) => props.theme.fontFamily};
}
body {
  background: 
    // radial-gradient(
    //   circle 500px at 80% 0%,
    //   HSLA(${(props) => props.theme.colors.primary}, 0.75),
    //   transparent
    //   ),
    // radial-gradient(
    //   circle 500px at 100% 90%,
    //   HSLA(${(props) => props.theme.colors.primary}, 0.75),
    //   transparent
    //   ),
    // radial-gradient(
    //   circle 400px at 60% 100%,
    //   HSLA(${(props) => props.theme.colors.primary}, 0.5),
    //   transparent
    //   ),
    linear-gradient(
      130deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.05) 50%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 50%
    ),
    linear-gradient(
      330deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 50%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 50%
    ),
    linear-gradient(
      220deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 70%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 70%
    ),
    linear-gradient(
      270deg,
      HSLA(${(props) => props.theme.colors.primary}, 1),
      HSLA(${(props) => props.theme.colors.secondary}, 1)
    )
    
  ;

  justify-content: center;
}
`;
