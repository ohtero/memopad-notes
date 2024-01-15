import { useRef, useState } from 'react';
import styled from 'styled-components';
import { DeleteIcon, EditIcon } from '../../assets/Icons';
import { Device } from '../../assets/breakpoints';

type ListItemProps = {
  listId: string;
  itemId: string;
  value: string;
  completed: boolean;
  handleClick: () => void;
};

export function ListItem({ listId, itemId, value, completed, handleClick }: ListItemProps) {
  const [itemValue, setItemValue] = useState<string>(value);
  const [initItemValue, setInitItemValue] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);

  const inputRef = useRef<HTMLInputElement>(null);

  async function updateItem() {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ list_item_value: itemValue }),
    };

    if (initItemValue !== itemValue) {
      try {
        await fetch(`http://localhost:4000/lists/${listId}/${itemId}`, options);
      } catch (err) {
        console.error('Could not update list item', err);
      } finally {
        setInitItemValue('');
      }
    }
  }

  async function syncCompletionState() {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      const res = await fetch(`http://localhost:4000/lists/${listId}/${itemId}/${!isCompleted}`, options);
      if (res.status === 500) {
        console.error('Internal server error');
      }
    } catch (err) {
      console.error('Could not update completion state: ', err);
    }
  }

  return (
    <ItemContainer $completed={isCompleted}>
      <TextContainer>
        <Overlay
          disabled={isDisabled}
          onDoubleClick={() => {
            setIsCompleted((prevState) => !prevState);
            void syncCompletionState();
            inputRef.current?.blur();
          }}
        />
        <ItemText
          ref={inputRef}
          value={itemValue}
          disabled={isDisabled}
          onChange={(e) => setItemValue(e.target.value)}
          onFocus={(e) => {
            setInitItemValue(e.target.value);
            inputRef.current?.setSelectionRange(-1, -1);
          }}
          onBlur={() => {
            void updateItem();
            setIsDisabled(true);
          }}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.blur()}
        />
      </TextContainer>
      <ButtonContainer>
        <EditButton
          onMouseDown={() => !isCompleted && setIsDisabled((prevState) => !prevState)}
          onMouseUp={() => {
            !isDisabled && !isCompleted && inputRef.current?.focus();
          }}
        >
          <EditIcon $dark height={'1.5rem'} />
        </EditButton>
        <DeleteButton onClick={handleClick}>
          <DeleteIcon $dark height={'1.75rem'} />
        </DeleteButton>
      </ButtonContainer>
    </ItemContainer>
  );
}

const ItemContainer = styled.div<{ $completed?: boolean }>`
  display: flex;
  background: ${(props) => props.theme.colors.secondary};
  gap: 0.5rem;
  align-items: center;
  border-radius: 5px;
  box-shadow: ${(props) => props.theme.shadows.extraSmall};
  opacity: ${(props) => props.$completed && '50%'};
`;
// @media (max-width: ${Device.sm}) {
// padding: clamp(0.5rem, 3vw, 0.75rem) 0.5rem;
// }

const TextContainer = styled.div`
  flex-basis: 100%;
  position: relative;
  padding: 0.75rem 0.5rem;
  @media (max-width: ${Device.sm}) {
    padding: clamp(0.5rem, 3vw, 0.75rem) 0.5rem;
  }
`;

const Overlay = styled.div<{ disabled: boolean }>`
  display: ${(props) => !props.disabled && 'none'};
  width: 100%;
  position: absolute;
  background: red;
  opacity: 0;
  height: 100%;
  top: 0;
  left: 0;
`;

const ItemText = styled.input<{ disabled: boolean }>`
  width: 100%;
  height: fit-content;
  font-size: 1rem;
  border: none;
  outline: none;
  background: inherit;
  color: ${(props) => props.theme.colors.background};
  cursor: ${(props) => props.readOnly && 'default'};
  &::selection {
    background: ${(props) => props.readOnly && 'none'};
  }
  &:focus {
    box-shadow: ${(props) => (props.readOnly ? 'none' : '#444 0px 2px')};
  }
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-right: 0.5rem;
  align-items: center;
  @media (max-width: ${Device.sm}) {
    gap: clamp(0rem, 1vw, 0.5rem);
  }
`;

const EditButton = styled.button`
  display: flex;
  background: inherit;
  border: none;
  padding: 0;
`;

const DeleteButton = styled.button`
  display: flex;
  background: inherit;
  border: none;
  padding: 0;
`;
