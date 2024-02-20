import { useRef, useState } from 'react';
import styled from 'styled-components';
import { DeleteIcon, EditIcon } from '../assets/Icons';
import { modifyRequest } from '../utils/modifyRequest';

const apiUrl = import.meta.env.VITE_API_URL;

type ListItemProps = {
  listId: string;
  itemId: string;
  value: string;
  completed: boolean;
  handleClick: () => void;
};

export function Item({ listId, itemId, value, completed, handleClick }: ListItemProps) {
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
      const res = await modifyRequest(apiUrl + `/lists/${listId}/${itemId}`, options);
      if (!res.success) {
        console.error('Could not update list item', res.error);
      }
      setInitItemValue('');
    }
  }

  async function syncCompletionState() {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await modifyRequest(apiUrl + `/lists/${listId}/${itemId}/${!isCompleted}`, options);
    if (!res.success) {
      console.error('Could not update completion state: ', res.error);
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
  gap: 0.5rem;
  margin: 0 0.5rem;
  align-items: center;
  border-radius: 3px;
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  opacity: ${(props) => props.$completed && '50%'};
  backdrop-filter: blur(5px);
  border: 3px solid HSLA(${(props) => props.theme.colors.primary}, 0.25);
`;

const TextContainer = styled.div`
  flex-basis: 100%;
  position: relative;
  padding: 0.75rem 0.5rem;
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
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
  cursor: ${(props) => props.readOnly && 'default'};
  &::selection {
    background: ${(props) => props.readOnly && 'none'};
  }
  &:focus {
    box-shadow: ${(props) => (props.readOnly ? 'none' : '#444 0px 2px')};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-right: 0.5rem;
  align-items: center;
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
