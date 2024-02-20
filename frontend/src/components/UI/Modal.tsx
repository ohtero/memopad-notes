import { forwardRef } from 'react';
import styled from 'styled-components';

type ModalProps = {
  children?: React.ReactNode;
};

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(({ children }, ref) => {
  return (
    <ModalContainer ref={ref}>
      <ContentWrapper>{children}</ContentWrapper>
    </ModalContainer>
  );
});

Modal.displayName = 'Modal';
const ModalContainer = styled.dialog`
  width: min(100vw, 20rem);
  margin: auto;
  border: 0;
  border-radius: 3px;
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
  box-shadow: ${(props) => props.theme.shadows.bottomSmall};
  &::backdrop {
    background: HSLA(0, 0%, 0%, 0.25);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;
