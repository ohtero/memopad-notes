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
    linear-gradient(
      100deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.05) 71%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 71%
    ),
    linear-gradient(
      125deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 75%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 75%
    ),
    linear-gradient(
      150deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 80%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 80%
    ),
    linear-gradient(
      175deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.05) 90%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 90%
    ),
    linear-gradient(
      70deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 60%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 60%
    ),
    linear-gradient(
      25deg,
      HSLA(${(props) => props.theme.colors.primary}, 0.1) 35%,
      HSLA(${(props) => props.theme.colors.secondary}, 0.1) 35%
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
