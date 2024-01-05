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
  border-radius: 5px;
  background: ${(props) => props.theme.colors.main};
  color: ${(props) => props.theme.colors.offWhite};
  box-shadow: ${(props) => props.theme.shadows.extraSmall};
  &::backdrop {
    background: HSLA(0, 0%, 0%, 0.5);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;
