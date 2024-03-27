import { forwardRef, useRef, useState } from 'react';
import styled from 'styled-components';
import { DeleteIcon, EditIcon } from '../assets/Icons';
import { modifyRequest } from '../utils/modifyRequest';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes, UniqueIdentifier } from '@dnd-kit/core';
import { Device } from '../assets/breakpoints';

const apiUrl = import.meta.env.VITE_API_URL;

type ListItemProps = {
  listId: number;
  itemId: string;
  value: string;
  completed: boolean;
  handleClick: () => void;
  updateItemValue?: (itemId: string, newValue: string) => void;
  style?: object;
  listeners?: SyntheticListenerMap | undefined;
  attributes?: DraggableAttributes;
  activeId?: UniqueIdentifier | null;
};

const Item = forwardRef<HTMLLIElement, ListItemProps>(
  ({ listId, itemId, value, completed, handleClick, updateItemValue, activeId, style, ...props }, ref) => {
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
        updateItemValue && updateItemValue(itemId, itemValue);
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
      <ItemContainer ref={ref} style={style} $completed={isCompleted} $active={activeId} $itemId={itemId}>
        <TextContainer {...props}>
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
            <EditIcon $dark height={'1.6rem'} />
          </EditButton>
          <DeleteButton onClick={handleClick}>
            <DeleteIcon $dark height={'2rem'} />
          </DeleteButton>
        </ButtonContainer>
      </ItemContainer>
    );
  }
);

Item.displayName = 'Item';

export default Item;

const ItemContainer = styled.li<{ $completed?: boolean; $active?: UniqueIdentifier | null; $itemId: string }>`
  opacity: ${(props) => (props.$active === props.$itemId ? '0' : props.$completed ? '0.5' : 1)};
  display: flex;
  width: 35vw;
  gap: 0.5rem;
  border-radius: 3px;
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  border: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.25);
  touch-action: none;
  @media (max-width: ${Device.sm}) {
    width: calc(98vw - 1rem);
`;

const TextContainer = styled.div`
  flex-basis: 100%;
  position: relative;
  padding: 0.75rem 0.5rem;
  touch-action: none;
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

  align-items: center;
`;

const EditButton = styled.button`
  display: flex;
  background: inherit;
  border: none;
  padding: 0 0.5rem;
  border-right: 1px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  border-left: 1px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
`;

const DeleteButton = styled.button`
  display: flex;
  background: inherit;
  border: none;
  padding-left: 0.4rem;
  padding-right: 0.5rem;
`;
