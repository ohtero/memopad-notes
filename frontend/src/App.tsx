import './App.css';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { theme } from './assets/app-theme';
import { GlobalStyles } from './assets/globalStyles';
import { OptionMenu } from './components/OptionMenu';
import { PageContainer } from './components/PageContainer';
import { ListSelection } from './pages/ListSelection';
import { SelectedList } from './pages/SelectedList';
import { ListProvider } from './context/listContext';
import { Device } from './assets/breakpoints';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ListProvider>
        <StyledApp>
          <GlobalStyles />
          <PageContainer>
            <Routes>
              <Route path="/" element={<ListSelection />} />
              <Route path="list">
                <Route path=":id" element={<SelectedList />} />
              </Route>
            </Routes>
          </PageContainer>
          <OptionMenu />
        </StyledApp>
      </ListProvider>
    </ThemeProvider>
  );
}

const StyledApp = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;

  width: min(100vw, 30rem);
  height: 100svh;
  background: ${(props) => props.theme.colors.main};

  @media (min-width: ${Device.sm}) {
    margin-top: 2rem;
    height: 80svh;
  }
`;

export default App;
