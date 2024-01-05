import styled from 'styled-components';

type ParagProps = {
  children: string | string[];
  $bold?: boolean;
};

export function Paragraph({ children, $bold }: ParagProps) {
  return <Parag $bold={$bold}>{children}</Parag>;
}

const Parag = styled.p<{ $bold?: boolean }>`
  text-align: center;
  font-weight: ${(props) => props.$bold && 'bold'};
`;
