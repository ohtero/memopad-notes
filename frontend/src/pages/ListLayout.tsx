import styled from 'styled-components';
import { ListContainer } from '../components/ListContainer';
import { Outlet } from 'react-router-dom';
import { OptionMenu } from '../components/OptionMenu';
import { Device } from '../assets/breakpoints';

export function ListLayout() {
  return (
    <LayoutWrapper>
      <ListContainer>
        <Outlet />
      </ListContainer>
      <OptionMenu />
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled.div`
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
