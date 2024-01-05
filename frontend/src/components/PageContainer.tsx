import styled from 'styled-components';

interface ListContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: ListContainerProps) {
  return <Container>{children}</Container>;
}

const Container = styled.main`
  height: 100%;
`;
