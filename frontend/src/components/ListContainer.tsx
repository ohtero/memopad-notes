import styled from 'styled-components';
import { Device } from '../assets/breakpoints';

interface ListContainerProps {
  children: React.ReactNode;
}

export function ListContainer({ children }: ListContainerProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  grid-row: list-start / list-end;
  height: 100%;
  width: 100%;
  padding: 1rem;
  border-radius: 3px;
  overflow-y: hidden;
  background: HSLA(${(props) => props.theme.colors.primary}, 0.25);
  backdrop-filter: blur(7px);
  box-shadow: ${(props) => props.theme.shadows.bottomSmall};

  @media (max-width: ${Device.sm}) {
    padding: 0 0 0 0;
    box-shadow: none;
  }
`;
