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
  letter-spacing: 0.1rem;
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
  background: HSLA(${(props) => props.theme.colors.secondary}, 1);
  border: 3px solid HSLA(${(props) => props.theme.colors.primary}, 0.25);
  // border-style: inset;
  &:hover {
    cursor: pointer;
    background: HSLA(${(props) => props.theme.colors.highlight}, 1);
  }
  &:active {
    color: #bbb;
    text-shadow: none;
  }
`;
