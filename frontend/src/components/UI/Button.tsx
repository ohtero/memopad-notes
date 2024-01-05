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
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.secondary};
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.highlight};
  }
  &:active {
    color: #bbb;
    text-shadow: none;
  }
`;
