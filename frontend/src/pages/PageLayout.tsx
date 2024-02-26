import styled from 'styled-components';
import { ListContainer } from '../components/ListContainer';
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
              <ListWrapper>
                <ListContainer>
                  <Outlet />
                </ListContainer>
              </ListWrapper>
            </Main>
          </DesktopView>
          <MobileView>
            <Main>
              <ListWrapper>
                <ListContainer>
                  <Outlet />
                </ListContainer>
                <OptionMenu />
              </ListWrapper>
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
  grid-template-columns: [left-start] 1fr [left-end mid-start] 40% [mid-end right-start] 1fr [right-end];
  column-gap: clamp(1rem, 3vw, 4rem);
  row-gap: 2rem;

  @media (max-width: ${Device.sm}) {
    grid-template-rows: [main-start] auto [main-end];
    grid-template-columns: [left-start] auto [right-end];
  }
`;

const Header = styled.header`
  display: flex;
  grid-row: header-start / header-end;
  grid-column: left-start / right-end;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid HSLA(${(props) => props.theme.colors.primaryDark}, 0.5);
`;

const Heading = styled.h1`
  padding: 0.5rem 2rem;
  letter-spacing: 0.75rem;
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
  border-left: 3px solid HSLA(${(props) => props.theme.colors.primaryDark}, 0.5);
  border-right: 3px solid HSLA(${(props) => props.theme.colors.primaryDark}, 0.5);
`;

const Main = styled.main`
  display: grid;
  grid-row: main-start / main-end;
  grid-column: left-start / right-end;
  grid-template-rows: [main-start] auto [main-end];
  grid-template-columns: subgrid;
  // height: 100%;
  margin: 0 2rem;
  @media (max-width: ${Device.sm}) {
    margin: 0;
  }
`;

const ListWrapper = styled.div`
  display: grid;
  grid-row: main-start / main-end;
  grid-column: mid-start / mid-end;
  grid-template-rows: [list-start] 1fr [list-end];
  width: 100%;
  height: 80svh;
  align-content: space-between;

  @media (max-width: ${Device.sm}) {
    grid-template-rows: [list-start] 1fr [list-end list-footer-start] auto [list-footer-end];
    height: 100vh;
    height: 100svh;
  }
`;
