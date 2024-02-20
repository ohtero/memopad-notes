import styled from 'styled-components';

type MenuButtonProps = {
  children: string | React.ReactNode;
  handleClick?: () => void;
};

export function MenuButton({ children, handleClick }: MenuButtonProps) {
  return <Button onClick={handleClick}>{children}</Button>;
}

export const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: 0;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 3px;
  background: HSLA(${(props) => props.theme.colors.secondary}, 1);
  border: 1px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  border-style: inset;
  // box-shadow: ${(props) => props.theme.shadows.extraSmall};
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.highlight};
  }
  &:active {
    color: #bbb;
    text-shadow: none;
  }
`;
