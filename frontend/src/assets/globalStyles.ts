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
  background: ${(props) => props.theme.colors.background};
  display: flex;
  justify-content: center;
}
`;
