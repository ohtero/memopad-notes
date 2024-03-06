import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { OptionMenu } from '../components/OptionMenu';
import { Device } from '../assets/breakpoints';
import { ListSelection } from './ListSelection';
import { ListNameProvider } from '../context/ListNameContext';
import { DesktopView, MobileView } from '../config/screensize';

export function PageLayout() {
  return (
    <>
      <ListNameProvider>
        <PageContainer>
          <DesktopView>
            <Header>
              <Heading>MEMOPAD NOTES</Heading>
            </Header>
            <Main>
              <ListSelection />
              <Outlet />
            </Main>
          </DesktopView>
          <MobileView>
            <Main>
              <Outlet />
              <OptionMenu />
            </Main>
          </MobileView>
        </PageContainer>
      </ListNameProvider>
    </>
  );
}

const PageContainer = styled.div`
  height: 100vh;
  height: 100svh;
  display: grid;
  grid-template-rows: [header-start] auto [header-end main-start] auto [main-end];
  grid-template-columns: [left-start] 1fr [left-end mid-start] 2fr [mid-end right-start] 1fr [right-end];
  row-gap: 2rem;

  @media (max-width: ${Device.sm}) {
    grid-template-rows: [main-start] auto [main-end];
    grid-template-columns: [left-start] auto [right-end];
  }
`;

const Main = styled.main`
  display: grid;
  justify-items: center;
  height: 80svh;
  grid-row: main-start / main-end;
  grid-column: left-start / right-end;
  grid-template-rows: [main-start] auto [main-end];
  grid-template-columns: subgrid;
  margin: 0 2rem;
  @media (max-width: ${Device.sm}) {
    grid-template-rows: [main-start] 1fr [main-end footer-start] auto [footer-end];
    align-content: space-between;
    margin: 0;
    height: 100svh;
  }
`;

const Header = styled.header`
  display: flex;
  grid-row: header-start / header-end;
  grid-column: left-start / right-end;
  align-items: center;
  justify-content: center;
`;

const Heading = styled.h1`
  padding: 0.5rem 2rem;
  letter-spacing: 0.75rem;
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
  border-left: 3px solid HSLA(${(props) => props.theme.colors.primaryDark}, 0.5);
  border-right: 3px solid HSLA(${(props) => props.theme.colors.primaryDark}, 0.5);
`;
