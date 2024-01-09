import styled from 'styled-components';

interface ListContainerProps {
  children: React.ReactNode;
}

export function ListContainer({ children }: ListContainerProps) {
  return <Container>{children}</Container>;
}

const Container = styled.main`
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 12px;
  }
`;
